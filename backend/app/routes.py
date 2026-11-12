
from fastapi import (
    APIRouter, Depends, HTTPException, status,
    UploadFile, File, Query, Request, Form
)
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy import func, desc, or_
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from datetime import datetime, timedelta
from typing import List, Optional
from pathlib import Path
from jose import JWTError, jwt as jose_jwt
from passlib.context import CryptContext
import math
import uuid
import os
import base64
import json
import httpx
import jwt as pyjwt

from app.database import get_db
from app.models import (
    User, Plant, Order, OrderItem, Address,
    Payment, WishList, CheckoutDraft
)
from app.schemas import (
    PlantCreate, PlantResponse, PlantFilterRequest,
    SelectionCreate, OrderItemCreate, OrderCreate,
    OrderResponse, OrderItemResponse, StatusUpdate,
    WishlistItemCreate, WishlistItemResponse,
    UserSignup, UserLogin, UserResponse, UpdateProfile,
    ChangePassword, TokenResponse,
    PaginatedPlants, BestSellerResponse,
    PaginatedBestSellers, AddressCreate,
    AddressUpdate, AddressResponse
)
from config import (
    TWO_C2P_MERCHANT_ID,
    TWO_C2P_SECRET_KEY,
    TWO_C2P_CURRENCY,
    TWO_C2P_BASE_URL
)


router = APIRouter()

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login"
)

SECRET_KEY = "change-this-to-a-long-random-secret-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


# -------------------------
# AUTHENTICATION HELPERS
# -------------------------

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None
) -> str:
    to_encode = data.copy()

    expire = datetime.utcnow() + (
        expires_delta or
        timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    to_encode.update({"exp": expire})

    return jose_jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )

    try:
        payload = jose_jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        email: str = payload.get("sub")

        if email is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(
        User.email == email
    ).first()

    if user is None:
        raise credentials_exception

    return user


def require_admin(
    current_user: User = Depends(get_current_user)
) -> User:

    if not current_user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return current_user


# -------------------------
# GENERAL HELPERS
# -------------------------

def paginate(query, page: int, limit: int):

    total = query.count()

    pages = math.ceil(total / limit) if limit > 0 else 1

    items = (
        query
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": pages,
        "has_next": page < pages,
        "has_prev": page > 1
    }


def _extract_pet_bool(pet_value):

    if pet_value is None:
        return None

    if isinstance(pet_value, bool):
        return pet_value

    if isinstance(pet_value, dict):
        value = pet_value.get("value")

        if isinstance(value, bool):
            return value

        if isinstance(value, str):
            return value.lower() in ("yes", "true", "1")

    return None


def match_plants(selection: dict, db: Session):

    room_light = selection.get("room_light", "").lower().strip()
    has_pets = selection.get("has_pets", False)
    care = selection.get("care_commitment", "").lower().strip()
    desired_size = selection.get("desired_size", "").lower().strip()
    style = selection.get("style_preference", "").lower().strip()

    plants = db.query(Plant).all()
    matched = []

    for plant in plants:

        if has_pets and not plant.is_pet_safe:
            continue

        plant_light = (plant.light_requirement or "").lower()
        light_match = False

        if "sun" in room_light:
            light_match = "bright direct" in plant_light
        elif "indirect" in room_light:
            light_match = (
                "bright indirect" in plant_light
                or "adaptable" in plant_light
            )
        elif "low" in room_light:
            light_match = (
                "low" in plant_light
                or "adaptable" in plant_light
            )
        elif "bright" in room_light:
            light_match = "bright" in plant_light

        if not light_match:
            continue

        plant_care = (plant.care_level or "").lower()
        plant_maintenance = (plant.maintenance or "").lower()
        care_match = False

        if "enthusiast" in care or "detailed" in care:
            care_match = plant_care in ["moderate", "expert"]
        elif "moderate" in care:
            care_match = plant_care in ["beginner", "moderate"]
        elif "low" in care or "minimal" in care:
            care_match = (
                plant_care == "beginner"
                or "low maintenance" in plant_maintenance
            )

        if not care_match:
            continue

        plant_size = (plant.size or "").lower()
        size_match = False

        if "small" in desired_size:
            size_match = plant_size == "small"
        elif "medium" in desired_size:
            size_match = plant_size == "medium"
        elif "large" in desired_size:
            size_match = plant_size == "large"

        if not size_match:
            continue

        if style:
            plant_style = (plant.style or "").lower()

            if plant_style != style:
                continue

        matched.append(plant)

    return matched[:6]

@router.get(
    "/api/plants/best-sellers",
    response_model=PaginatedBestSellers
)
def get_best_sellers(
    page: int = 1,
    limit: int = 3,
    db: Session = Depends(get_db)
):

    page = max(page, 1)
    limit = max(min(limit, 100), 1)

    total = (
        db.query(func.count(func.distinct(Plant.id)))
        .join(OrderItem, OrderItem.plant_id == Plant.id)
        .join(Order, Order.id == OrderItem.order_id)
        .filter(Order.status == "paid")
        .scalar()
    ) or 0

    if total > 0:

        results = (
            db.query(
                Plant,
                func.sum(OrderItem.quantity).label("total_sold")
            )
            .join(OrderItem, OrderItem.plant_id == Plant.id)
            .join(Order, Order.id == OrderItem.order_id)
            .filter(Order.status == "paid")
            .group_by(Plant.id)
            .order_by(desc("total_sold"), Plant.id.asc())
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )

        items = []

        for plant, total_sold in results:
            plant_data = PlantResponse.model_validate(plant).model_dump()
            plant_data["total_sold"] = int(total_sold or 0)
            items.append(plant_data)

    else:

        total = db.query(func.count(Plant.id)).scalar() or 0

        results = (
            db.query(Plant)
            .order_by(Plant.created_at.desc())
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )

        items = []

        for plant in results:
            plant_data = PlantResponse.model_validate(plant).model_dump()
            plant_data["total_sold"] = 0
            items.append(plant_data)

    pages = (total + limit - 1) // limit

    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": pages,
        "has_next": page < pages,
        "has_prev": page > 1
    }


@router.get(
    "/api/plants/new-arrivals",
    response_model=PaginatedPlants
)
def get_new_arrivals(
    page: int = 1,
    limit: int = 3,
    db: Session = Depends(get_db)
):

    page = max(page, 1)
    limit = max(min(limit, 100), 1)

    total = db.query(Plant).count()

    plants = (
        db.query(Plant)
        .order_by(Plant.created_at.desc(), Plant.id.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    pages = (total + limit - 1) // limit

    return {
        "items": plants,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": pages,
        "has_next": page < pages,
        "has_prev": page > 1
    }


@router.get(
    "/api/plants/low-light",
    response_model=PaginatedPlants
)
def get_low_light_plants(
    page: int = 1,
    limit: int = 3,
    db: Session = Depends(get_db)
):

    page = max(page, 1)
    limit = max(min(limit, 100), 1)

    query = db.query(Plant).filter(
        Plant.light_requirement.ilike("%low%")
    )

    total = query.count()

    plants = (
        query
        .order_by(Plant.id.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    pages = (total + limit - 1) // limit

    return {
        "items": plants,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": pages,
        "has_next": page < pages,
        "has_prev": page > 1
    }


@router.get(
    "/api/plants/pet-friendly",
    response_model=PaginatedPlants
)
def get_pet_friendly(
    page: int = 1,
    limit: int = 3,
    db: Session = Depends(get_db)
):

    page = max(page, 1)
    limit = max(min(limit, 100), 1)

    query = db.query(Plant).filter(
        Plant.is_pet_safe == True
    )

    total = query.count()

    plants = (
        query
        .order_by(Plant.id.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    pages = (total + limit - 1) // limit

    return {
        "items": plants,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": pages,
        "has_next": page < pages,
        "has_prev": page > 1
    }


@router.get(
    "/api/plants/{plant_id}",
    response_model=PlantResponse
)
def get_plant(
    plant_id: int,
    db: Session = Depends(get_db)
):

    plant = db.query(Plant).filter(
        Plant.id == plant_id
    ).first()

    if not plant:
        raise HTTPException(
            status_code=404,
            detail=f"Plant with id {plant_id} not found"
        )

    return plant


@router.get("/")
def read_root():
    return {"message": "Welcome to Leafly API"}


@router.get("/api/plants/", response_model=PaginatedPlants)
def get_plants(
    light: Optional[str] = None,
    size: Optional[str] = None,
    is_pet_safe: Optional[bool] = None,
    max_price: Optional[float] = None,
    care_level: Optional[str] = None,
    style: Optional[str] = None,
    category: Optional[str] = None,
    page: int = 1,
    limit: int = 9,
    db: Session = Depends(get_db)
):

    query = db.query(Plant)

    if light:
        value = light.lower().strip()

        if "low" in value:
            query = query.filter(
                Plant.light_requirement.ilike("%Low%")
            )
        elif "bright indirect" in value:
            query = query.filter(
                Plant.light_requirement.ilike("%Bright Indirect%")
            )
        elif "bright direct" in value or "full sun" in value:
            query = query.filter(
                Plant.light_requirement.ilike("%Bright Direct%")
            )
        elif "bright" in value:
            query = query.filter(
                Plant.light_requirement.ilike("%Bright%")
            )
        elif "medium" in value or "adaptable" in value:
            query = query.filter(
                Plant.light_requirement.ilike("%Adaptable%")
            )
        elif "indirect" in value:
            query = query.filter(
                Plant.light_requirement.ilike("%Indirect%")
            )
        else:
            query = query.filter(
                Plant.light_requirement.ilike(f"%{light}%")
            )

    if size:
        query = query.filter(Plant.size == size)

    if is_pet_safe is not None:
        query = query.filter(Plant.is_pet_safe == is_pet_safe)

    if max_price is not None:
        query = query.filter(Plant.price <= max_price)

    if care_level:
        query = query.filter(Plant.care_level == care_level)

    if style:
        query = query.filter(Plant.style == style)

    if category:
        query = query.filter(Plant.category == category)

    page = max(page, 1)
    limit = max(min(limit, 100), 1)

    return paginate(query, page, limit)


@router.post("/api/plant/", response_model=PaginatedPlants)
def filter_plants_post(
    filters: PlantFilterRequest,
    page: int = 1,
    limit: int = 6,
    db: Session = Depends(get_db)
):

    query = db.query(Plant)

    if filters.room_light:
        light = filters.room_light.lower().strip()

        if "low" in light:
            query = query.filter(
                Plant.light_requirement.ilike("%Low%")
            )
        elif "bright indirect" in light:
            query = query.filter(
                Plant.light_requirement.ilike("%Bright Indirect%")
            )
        elif "full sun" in light or "bright direct" in light:
            query = query.filter(
                Plant.light_requirement.ilike("%Bright Direct%")
            )
        elif "bright" in light:
            query = query.filter(
                Plant.light_requirement.ilike("%Bright%")
            )
        elif "medium" in light:
            query = query.filter(
                or_(
                    Plant.light_requirement.ilike("%Medium%"),
                    Plant.light_requirement.ilike("%Adaptable%")
                )
            )

    if filters.size:
        db_sizes = []

        for value in filters.size:
            value_lower = value.lower()

            if "small" in value_lower:
                db_sizes.append("Small")
            elif "medium" in value_lower:
                db_sizes.append("Medium")
            elif "large" in value_lower:
                db_sizes.append("Large")

        if db_sizes:
            query = query.filter(Plant.size.in_(db_sizes))

    pet_bool = _extract_pet_bool(filters.pet_friendly)

    if pet_bool is not None:
        query = query.filter(Plant.is_pet_safe == pet_bool)

    if filters.care_level:
        care_map = {
            "easy": "Beginner",
            "moderate": "Moderate",
            "advanced": "Expert"
        }

        db_care = [
            care_map.get(value.lower(), value)
            for value in filters.care_level
        ]

        query = query.filter(Plant.care_level.in_(db_care))

    if filters.price is not None:
        query = query.filter(Plant.price <= filters.price)

    if filters.category:
        query = query.filter(Plant.category.in_(filters.category))

    page = max(page, 1)
    limit = max(min(limit, 100), 1)

    return paginate(query, page, limit)


@router.post(
    "/api/plant-finder/",
    response_model=List[PlantResponse]
)
def plant_finder(
    selection: SelectionCreate,
    db: Session = Depends(get_db)
):

    selection_dict = selection.model_dump()

    matched = match_plants(selection_dict, db)

    return matched


@router.post("/api/plants/", response_model=PlantResponse)
def create_plant(
    plant: PlantCreate,
    db: Session = Depends(get_db)
):

    db_plant = Plant(**plant.model_dump())

    db.add(db_plant)
    db.commit()
    db.refresh(db_plant)

    return db_plant


@router.get("/api/plant/search")
def search_plants(
    keyword: str = Query(..., min_length=1),
    db: Session = Depends(get_db)
):

    plants = db.query(Plant).filter(
        Plant.name.ilike(f"%{keyword}%")
    ).all()

    return {
        "keyword": keyword,
        "total": len(plants),
        "plants": plants
    }

@router.post(
    "/api/wishlist",
    status_code=status.HTTP_201_CREATED
)
def add_to_wishlist(
    data: WishlistItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    plant = db.query(Plant).filter(
        Plant.id == data.plant_id
    ).first()

    if plant is None:
        raise HTTPException(404, "Plant not found")

    item = WishList(
        user_id=current_user.id,
        plant_id=data.plant_id
    )

    db.add(item)

    try:
        db.commit()
        db.refresh(item)

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Plant is already in your wishlist"
        )

    return {"message": "Plant added to wishlist"}


@router.get(
    "/api/wishlist",
    response_model=List[WishlistItemResponse]
)
def get_wishlist(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return (
        db.query(WishList)
        .options(joinedload(WishList.plant))
        .filter(WishList.user_id == current_user.id)
        .order_by(desc(WishList.created_at))
        .all()
    )


@router.delete("/api/wishlist/{plant_id}")
def remove_from_wishlist(
    plant_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    item = db.query(WishList).filter(
        WishList.user_id == current_user.id,
        WishList.plant_id == plant_id
    ).first()

    if item is None:
        raise HTTPException(404, "Wishlist item not found")

    db.delete(item)
    db.commit()

    return {"message": "Plant removed from wishlist"}


@router.delete("/api/wishlist")
def remove_all_from_wishlist(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    deleted_count = db.query(WishList).filter(
        WishList.user_id == current_user.id
    ).delete(synchronize_session=False)

    db.commit()

    return {
        "message": "Wishlist cleared",
        "deleted_count": deleted_count
    }

@router.post(
    "/api/auth/signup",
    response_model=TokenResponse,
    status_code=201
)
def signup(
    payload: UserSignup,
    db: Session = Depends(get_db)
):

    existing = db.query(User).filter(
        func.lower(User.email) == payload.email.lower()
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    user = User(
        email=payload.email.lower(),
        full_name=payload.full_name,
        phone=payload.phone,
        hashed_password=hash_password(payload.password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({
        "sub": user.email,
        "uid": user.id
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "user": user
    }


@router.post("/api/auth/login", response_model=TokenResponse)
def login(
    payload: UserLogin,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        func.lower(User.email) == payload.email.lower()
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="No account found with this email. Please sign up first."
        )

    if not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect password. Please try again."
        )

    token = create_access_token({
        "sub": user.email,
        "uid": user.id
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "user": user
    }


@router.post("/api/auth/token", response_model=TokenResponse)
def login_form(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        func.lower(User.email) == form_data.username.lower()
    ).first()

    if not user or not verify_password(
        form_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token({
        "sub": user.email,
        "uid": user.id
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "user": user
    }


@router.get("/api/auth/me", response_model=UserResponse)
def me(
    current_user: User = Depends(get_current_user)
):
    return current_user


@router.patch("/api/auth/me", response_model=UserResponse)
def update_me(
    payload: UpdateProfile,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if payload.full_name is not None:
        current_user.full_name = payload.full_name

    if payload.phone is not None:
        current_user.phone = payload.phone

    db.commit()
    db.refresh(current_user)

    return current_user


@router.post("/api/auth/change-password")
def change_password(
    payload: ChangePassword,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if not verify_password(
        payload.old_password,
        current_user.hashed_password
    ):
        raise HTTPException(
            status_code=400,
            detail="Old password is incorrect"
        )

    current_user.hashed_password = hash_password(
        payload.new_password
    )

    db.commit()

    return {"message": "Password updated successfully"}


@router.post("/api/auth/profile-image")
async def upload_profile_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    allowed_types = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp"
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, PNG, and WebP images are allowed"
        )

    content = await file.read()

    if not content:
        raise HTTPException(
            status_code=400,
            detail="Empty image file"
        )

    if len(content) > 2 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="Image must be smaller than 2 MB"
        )

    extension = allowed_types[file.content_type]

    filename = (
        f"user_{current_user.id}_{uuid.uuid4().hex}{extension}"
    )

    file_path = UPLOAD_DIR / filename

    try:
        with file_path.open("wb") as image:
            image.write(content)
    finally:
        await file.close()

    current_user.profile_image = f"/uploads/{filename}"

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Profile image updated successfully",
        "profile_image": current_user.profile_image
    }


@router.post("/api/auth/logout")
def logout(
    current_user: User = Depends(get_current_user)
):
    return {
        "message": f"Logged out {current_user.email}"
    }


@router.get(
    "/api/auth/users",
    response_model=list[UserResponse]
)
def list_users(
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    return db.query(User).order_by(User.id).all()


@router.post("/api/orders/", response_model=OrderResponse)
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if not order.items:
        raise HTTPException(
            400,
            "Order must have at least one item"
        )

    subtotal = sum(
        item.price * item.quantity
        for item in order.items
    )

    discount = 24.0 if subtotal > 0 else 0
    shipping_fee = 8.0
    tax = 10.0

    total = subtotal - discount + shipping_fee + tax

    db_order = Order(
        user_id=current_user.id,
        user_email=current_user.email,
        total=total,
        status="pending",
        shipping_name=order.shipping_name,
        shipping_phone=order.shipping_phone,
        shipping_address=order.shipping_address,
        shipping_city=order.shipping_city,
        shipping_zip=order.shipping_zip,
        shipping_country=order.shipping_country,
        payment_method=order.payment_method,
        payment_last4=order.payment_last4
    )

    try:
        db.add(db_order)
        db.flush()

        created_date = db_order.created_at or datetime.utcnow()

        db_order.order_number = (
            f"LF-{created_date:%Y%m%d}-{db_order.id:04d}"
        )

        if order.payment_method != "COD":
            db_payment = Payment(
                order_id=db_order.id,
                invoice_no=db_order.order_number,
                amount=total,
                currency=TWO_C2P_CURRENCY,
                payment_method="2C2P",
                status="pending"
            )

            db.add(db_payment)

        for item in order.items:
            db_item = OrderItem(
                order_id=db_order.id,
                plant_id=item.plant_id,
                plant_name=item.plant_name,
                image_url=item.image_url,
                category=item.category,
                price=item.price,
                quantity=item.quantity,
                subtotal=item.price * item.quantity
            )

            db.add(db_item)

        db.commit()
        db.refresh(db_order)

    except Exception:
        db.rollback()
        raise

    return db_order


@router.get(
    "/api/orders/search",
    response_model=List[OrderResponse]
)
def search_orders(
    q: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    search = f"%{q}%"

    orders = (
        db.query(Order)
        .outerjoin(Order.items)
        .filter(
            Order.user_id == current_user.id,
            or_(
                Order.order_number.ilike(search),
                Order.user_email.ilike(search),
                Order.items.any(
                    OrderItem.plant_name.ilike(search)
                )
            )
        )
        .distinct()
        .all()
    )

    return orders


@router.get("/api/orders/status/{status}", response_model=List[OrderResponse])
def get_orders_by_status(
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    orders = db.query(Order).filter(
        Order.user_id == current_user.id,
        Order.order_status == status
    ).all()

    return orders


@router.get("/api/orders/", response_model=List[OrderResponse])
def get_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    orders = (
        db.query(Order)
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )

    return orders


@router.get("/api/orders/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return order


@router.patch(
    "/api/orders/{order_id}/order_status",
    response_model=OrderResponse
)
def update_status(
    order_id: int,
    body: StatusUpdate,
    db: Session = Depends(get_db)
):

    valid = [
        "pending",
        "processing",
        "in_transit",
        "delivered",
        "cancelled"
    ]

    if body.order_status not in valid:
        raise HTTPException(
            400,
            f"Order status must be one of {valid}"
        )

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(404, "Order not found")

    order.order_status = body.order_status

    db.commit()
    db.refresh(order)

    return order


@router.post("/api/payments/{order_id}/create")
def create_payment(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()

    if not order:
        raise HTTPException(404, "Order not found")

    if order.payment_method == "COD":
        raise HTTPException(
            400,
            "COD does not require online payment"
        )

    payment = db.query(Payment).filter(
        Payment.order_id == order_id
    ).first()

    if not payment:
        raise HTTPException(404, "Payment not found")

    if payment.web_payment_url:
        return {
            "webPaymentUrl": payment.web_payment_url,
            "paymentToken": payment.payment_token,
            "respCode": payment.response_code or "0000"
        }

    amount_value = round(float(payment.amount), 2)

    payload = {
        "merchantID": "JT01",
        "invoiceNo": payment.invoice_no,
        "description": f"Leafly Order {order.order_number}",
        "amount": amount_value,
        "currencyCode": "SGD",
        "paymentChannel": ["CC"],
        "frontendReturnUrl": (
            "https://rink-coveted-trodden.ngrok-free.dev/api/payments/2c2p/return"
        ),
        "backendReturnUrl": (
            "https://rink-coveted-trodden.ngrok-free.dev/api/payments/2c2p/callback"
        )
    }

    try:
        token = pyjwt.encode(
            payload,
            TWO_C2P_SECRET_KEY,
            algorithm="HS256"
        )

        response = httpx.post(
            f"{TWO_C2P_BASE_URL.rstrip('/')}/payment/4.5/paymentToken",
            json={"payload": token},
            headers={"Content-Type": "application/json"},
            timeout=30
        )

        response.raise_for_status()
        response_data = response.json()

        if response_data.get("payload"):
            result = pyjwt.decode(
                response_data["payload"],
                TWO_C2P_SECRET_KEY,
                algorithms=["HS256"]
            )
        else:
            result = response_data

    except httpx.TimeoutException:
        raise HTTPException(504, "2C2P request timed out")

    except httpx.HTTPStatusError:
        raise HTTPException(502, "2C2P HTTP error")

    except httpx.RequestError:
        raise HTTPException(502, "Unable to connect to 2C2P")

    except pyjwt.InvalidTokenError:
        raise HTTPException(502, "Invalid 2C2P response signature")

    except ValueError:
        raise HTTPException(502, "Invalid JSON response")

    resp_code = str(result.get("respCode", ""))
    resp_desc = result.get("respDesc")

    payment.response_code = resp_code
    payment.response_description = resp_desc

    if resp_code == "0000":
        payment.payment_token = result.get("paymentToken")
        payment.web_payment_url = result.get("webPaymentUrl")
        payment.status = "pending"

    db.commit()

    if resp_code != "0000":
        raise HTTPException(
            status_code=502,
            detail={
                "message": "2C2P payment token request failed",
                "respCode": resp_code,
                "respDesc": resp_desc
            }
        )

    web_payment_url = result.get("webPaymentUrl")

    if not web_payment_url:
        raise HTTPException(
            status_code=502,
            detail="2C2P did not return a payment URL"
        )

    return {
        "webPaymentUrl": web_payment_url,
        "paymentToken": result.get("paymentToken"),
        "respCode": resp_code
    }


@router.get("/api/payments/verify/{invoice_no}")
def verify_payment(
    invoice_no: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    payment = db.query(Payment).filter(
        Payment.invoice_no == invoice_no
    ).first()

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found"
        )

    order = db.query(Order).filter(
        Order.id == payment.order_id,
        Order.user_id == current_user.id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return {
        "invoice_no": payment.invoice_no,
        "status": payment.status,
        "response_code": payment.response_code,
        "transaction_id": payment.transaction_id,
        "order": {
            "id": order.id,
            "payment_method": order.payment_method
        }
    }


@router.post("/api/payments/2c2p/return")
async def payment_return(
    paymentResponse: str = Form(...)
):

    try:
        decoded = base64.urlsafe_b64decode(
            paymentResponse + "=" * (-len(paymentResponse) % 4)
        )

        result = json.loads(decoded.decode("utf-8"))

    except Exception:
        raise HTTPException(400, "Invalid payment response")

    invoice_no = result.get("invoiceNo")
    resp_code = result.get("respCode")

    if not invoice_no:
        raise HTTPException(400, "Invoice number missing")

    frontend_url = os.getenv("FRONTEND_URL")

    return RedirectResponse(
        url=(
            f"{frontend_url}/payment/return"
            f"?invoiceNo={invoice_no}&respCode={resp_code}"
        ),
        status_code=303
    )


@router.post("/api/payments/2c2p/callback")
async def payment_callback(
    request: Request,
    db: Session = Depends(get_db)
):

    try:
        data = await request.json()

        encoded_payload = data.get("payload")

        if not encoded_payload:
            raise HTTPException(400, "2C2P payload missing")

        result = pyjwt.decode(
            encoded_payload,
            TWO_C2P_SECRET_KEY,
            algorithms=["HS256"]
        )

    except pyjwt.InvalidTokenError:
        raise HTTPException(400, "Invalid 2C2P signature")

    except ValueError:
        raise HTTPException(400, "Invalid JSON response")

    invoice_no = result.get("invoiceNo")
    resp_code = str(result.get("respCode", ""))

    if not invoice_no:
        raise HTTPException(400, "Invoice number missing")

    payment = db.query(Payment).filter(
        Payment.invoice_no == invoice_no
    ).first()

    if not payment:
        raise HTTPException(404, "Payment not found")

    if result.get("merchantID") != "JT01":
        raise HTTPException(400, "Invalid merchant ID")

    if (
        round(float(result.get("amount", 0)), 2)
        != round(float(payment.amount), 2)
        or result.get("currencyCode") != payment.currency
    ):
        raise HTTPException(
            400,
            "Payment amount or currency mismatch"
        )

    payment.response_code = resp_code
    payment.response_description = result.get("respDesc")
    payment.transaction_id = result.get("tranRef")

    if resp_code == "0000":
        payment.status = "paid"
    else:
        payment.status = "failed"

    db.commit()

    return {
        "message": "Payment callback processed",
        "invoiceNo": invoice_no,
        "status": payment.status
    }


@router.get("/api/sales/top-plants")
def top_plants(
    limit: int = 5,
    db: Session = Depends(get_db)
):

    results = (
        db.query(
            OrderItem.plant_id,
            OrderItem.plant_name,
            func.sum(OrderItem.quantity).label("total_sold"),
            func.sum(OrderItem.subtotal).label("revenue")
        )
        .group_by(
            OrderItem.plant_id,
            OrderItem.plant_name
        )
        .order_by(desc("total_sold"))
        .limit(limit)
        .all()
    )

    return [
        {
            "plant_id": r.plant_id,
            "plant_name": r.plant_name,
            "total_sold": r.total_sold,
            "revenue": round(r.revenue, 2)
        }
        for r in results
    ]


@router.get("/api/sales/revenue")
def revenue_by_day(
    days: int = 30,
    db: Session = Depends(get_db)
):

    since = datetime.utcnow() - timedelta(days=days)

    results = (
        db.query(
            func.date(Order.created_at).label("date"),
            func.count(Order.id).label("orders"),
            func.sum(Order.total).label("revenue")
        )
        .filter(Order.created_at >= since)
        .group_by(func.date(Order.created_at))
        .order_by(func.date(Order.created_at))
        .all()
    )

    return [
        {
            "date": str(r.date),
            "orders": r.orders,
            "revenue": round(r.revenue or 0, 2)
        }
        for r in results
    ]


@router.get("/api/sales/by-status")
def by_status(
    db: Session = Depends(get_db)
):

    results = (
        db.query(
            Order.status,
            func.count(Order.id).label("count"),
            func.sum(Order.total).label("revenue")
        )
        .group_by(Order.status)
        .all()
    )

    return [
        {
            "status": r.status,
            "count": r.count,
            "revenue": round(r.revenue or 0, 2)
        }
        for r in results
    ]


@router.get("/api/sales/recent")
def recent_orders(
    limit: int = 10,
    db: Session = Depends(get_db)
):

    orders = (
        db.query(Order)
        .order_by(desc(Order.created_at))
        .limit(limit)
        .all()
    )

    return [
        {
            "id": order.id,
            "email": order.user_email,
            "total": order.total,
            "status": order.status,
            "created_at": order.created_at.isoformat(),
            "items_count": len(order.items)
        }
        for order in orders
    ]


# -------------------------
# ADDRESS APIs
# -------------------------

@router.post("/api/addresses/")
def create_address(
    data: AddressCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if data.is_default:
        db.query(Address).filter(
            Address.user_id == current_user.id,
            Address.is_default.is_(True)
        ).update({"is_default": False})

    address = Address(
        **data.model_dump(),
        user_id=current_user.id
    )

    db.add(address)
    db.commit()

    return {"message": "Address saved successfully"}


@router.patch("/api/addresses/")
def patch_default_address(
    payload: AddressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    address = db.query(Address).filter(
        Address.user_id == current_user.id
    ).first()

    if not address:
        raise HTTPException(404, "Address not found")

    if payload.recipient_name is not None:
        address.recipient_name = payload.recipient_name

    if payload.phone is not None:
        address.phone = payload.phone

    if payload.address_line is not None:
        address.address_line = payload.address_line

    if payload.apt is not None:
        address.apt = payload.apt

    if payload.city is not None:
        address.city = payload.city

    if payload.region is not None:
        address.region = payload.region

    if payload.postal_code is not None:
        address.postal_code = payload.postal_code

    if payload.is_default is not None:
        address.is_default = payload.is_default

    db.commit()

    return {"message": "Address saved successfully"}


@router.patch(
    "/api/addresses/{address_id}",
    response_model=AddressResponse
)
def patch_address(
    address_id: int,
    data: AddressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    address = db.query(Address).filter(
        Address.id == address_id,
        Address.user_id == current_user.id
    ).first()

    if not address:
        raise HTTPException(404, "Address not found")

    update_data = data.model_dump(exclude_unset=True)

    if update_data.get("is_default") is True:
        db.query(Address).filter(
            Address.user_id == current_user.id,
            Address.id != address_id,
            Address.is_default.is_(True)
        ).update({"is_default": False})

    for key, value in update_data.items():
        setattr(address, key, value)

    db.commit()
    db.refresh(address)

    return address


@router.get(
    "/api/addresses/",
    response_model=list[AddressResponse]
)
def get_addresses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return db.query(Address).filter(
        Address.user_id == current_user.id
    ).all()


@router.get(
    "/api/addresses/{address_id}",
    response_model=AddressResponse
)
def get_address(
    address_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    address = db.query(Address).filter(
        Address.id == address_id,
        Address.user_id == current_user.id
    ).first()

    if not address:
        raise HTTPException(404, "Address not found")

    return address

@router.post("/api/checkout-draft")
def save_checkout_draft(
    data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    draft = db.query(CheckoutDraft).filter(
        CheckoutDraft.user_id == current_user.id
    ).first()

    if draft:
        draft.draft_data = data
    else:
        draft = CheckoutDraft(
            user_id=current_user.id,
            draft_data=data
        )

        db.add(draft)

    db.commit()

    return {"message": "Draft saved successfully"}


@router.get("/api/checkout-draft")
def get_checkout_draft(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    draft = db.query(CheckoutDraft).filter(
        CheckoutDraft.user_id == current_user.id
    ).first()

    if not draft:
        return {"draft_data": None}

    return {"draft_data": draft.draft_data}


@router.delete("/api/checkout-draft")
def delete_checkout_draft(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    draft = db.query(CheckoutDraft).filter(
        CheckoutDraft.user_id == current_user.id
    ).first()

    if not draft:
        return {"message": "No checkout draft found"}

    db.delete(draft)
    db.commit()

    return {"message": "Checkout draft deleted successfully"}

