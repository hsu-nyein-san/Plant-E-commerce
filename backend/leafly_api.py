from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean, Float, Text,DateTime, ForeignKey,func,desc, or_
from sqlalchemy.orm import sessionmaker, declarative_base, Session ,relationship
from pydantic import BaseModel
from datetime import datetime,timedelta
from typing import List, Optional, Union
import uvicorn
import math
from fastapi import HTTPException

DB_USER = 'root'
DB_PASSWORD = ''
DB_HOST = 'localhost'
DB_PORT = '3306'
DB_NAME = 'leafly_db'

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Plant(Base):
    __tablename__ = "plants"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    subtitle = Column(String(150))
    price = Column(Float)
    image_url = Column(String(500))

    light_requirement = Column(String(100))
    water_frequency = Column(String(100))
    maintenance = Column(String(100))
    is_pet_safe = Column(Boolean, default=False)
    size = Column(String(50))
    care_level = Column(String(50))
    style = Column(String(50))
    category = Column(String(50))            # 👈 NEW
    description = Column(Text)

    # Detail page
    sku = Column(String(50))
    dimensions = Column(String(100))
    origin = Column(String(100))
    care_instructions = Column(Text)


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String(200), index=True)
    total = Column(Float, default=0)

    status = Column(String(50), default="pending", index=True)

    shipping_name = Column(String(200))
    shipping_phone = Column(String(50))
    shipping_address = Column(String(300))
    shipping_city = Column(String(100))
    shipping_zip = Column(String(20))
    shipping_country = Column(String(100), default="Myanmar")

    payment_method = Column(String(50))     # Card, ApplePay, GPay
    payment_last4 = Column(String(4))       # Card ending

    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), index=True)

    plant_id = Column(Integer, ForeignKey("plants.id"), index=True)
    plant_name = Column(String(200))       
    price = Column(Float)                    
    quantity = Column(Integer, default=1)
    subtotal = Column(Float)                 

    order = relationship("Order", back_populates="items")



Base.metadata.create_all(bind=engine)


class PlantCreate(BaseModel):
    name: str
    subtitle: str
    price: float
    image_url: str
    light_requirement: str
    water_frequency: str
    maintenance: str
    is_pet_safe: bool
    size: str
    care_level: str
    style: str
    category: str                           
    description: str
    sku: str
    dimensions: str
    origin: str
    care_instructions: str

class OrderItemCreate(BaseModel):
    plant_id: int
    plant_name: str
    price: float
    quantity: int


class OrderCreate(BaseModel):
    user_email: str
    shipping_name: str
    shipping_phone: str
    shipping_address: str
    shipping_city: str
    shipping_zip: str
    shipping_country: str = "Myanmar"
    payment_method: str         
    payment_last4: Optional[str] = None
    items: List[OrderItemCreate]

class OrderItemResponse(BaseModel):
    id: int
    plant_id: int
    plant_name: str
    price: float
    quantity: int
    subtotal: float

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    user_email: str
    total: float
    status: str
    shipping_name: str
    shipping_city: str
    payment_method: str
    created_at: datetime
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True



class SalesSummary(BaseModel):
    total_orders: int
    total_revenue: float
    total_items_sold: int
    avg_order_value: float
    pending_orders: int
    paid_orders: int
    delivered_orders: int


class PlantResponse(PlantCreate):
    id: int
    class Config:
        from_attributes = True


class SelectionCreate(BaseModel):
    room_light: str
    has_pets: bool
    care_commitment: str
    desired_size: str
    style_preference: str


class PlantFilterRequest(BaseModel):
    room_light: Optional[str] = None
    size: Optional[List[str]] = None
    pet_friendly: Optional[Union[bool, dict]] = None
    care_level: Optional[List[str]] = None
    price: Optional[float] = None
    category: Optional[List[str]] = None

class PaginatedPlants(BaseModel):
    items: List[PlantResponse]
    total: int
    page: int
    limit: int
    pages: int
    has_next: bool
    has_prev: bool


app = FastAPI(title="Leafly API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def paginate(query, page: int, limit: int):
    total = query.count()
    pages = math.ceil(total / limit) if limit > 0 else 1
    items = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": pages,
        "has_next": page < pages,
        "has_prev": page > 1,
    }



def match_plants(selection: dict, db: Session):

    room_light = selection.get("room_light", "").lower().strip()
    has_pets = selection.get("has_pets", False)
    care = selection.get("care_commitment", "").lower().strip()
    desired_size = selection.get("desired_size", "").lower().strip()
    style = selection.get("style_preference", "").lower().strip()

    plants = db.query(Plant).all()
    matched = []

    print("\n" + "=" * 60)
    print("🌿 PLANT FINDER MATCHING")
    print("=" * 60)
    print(f"Light:  {room_light}")
    print(f"Pets:   {has_pets}")
    print(f"Care:   {care}")
    print(f"Size:   {desired_size}")
    print(f"Style:  {style}")
    print("=" * 60)

    for plant in plants:

        if has_pets and not plant.is_pet_safe:
            print(f"{plant.name}: Not pet safe")
            continue

        # 2. LIGHT
        plant_light = (plant.light_requirement or "").lower()
        light_match = False
        if "sun" in room_light:
            light_match = "bright direct" in plant_light
        elif "indirect" in room_light:
            light_match = ("bright indirect" in plant_light or "adaptable" in plant_light)
        elif "low" in room_light:
            light_match = ("low" in plant_light or "adaptable" in plant_light)
        elif "bright" in room_light:
            light_match = "bright" in plant_light
        if not light_match:
            print(f" {plant.name}: Light mismatch ({plant.light_requirement})")
            continue

        # 3. CARE
        plant_care = (plant.care_level or "").lower()
        plant_maintenance = (plant.maintenance or "").lower()
        care_match = False
        if "enthusiast" in care or "detailed" in care:
            care_match = plant_care in ["moderate", "expert"]
        elif "moderate" in care:
            care_match = plant_care in ["beginner", "moderate"]
        elif "low" in care or "minimal" in care:
            care_match = (plant_care == "beginner" or "low maintenance" in plant_maintenance)
        if not care_match:
            print(f"{plant.name}: Care mismatch ({plant.care_level}, {plant.maintenance})")
            continue

        # 4. SIZE
        plant_size = (plant.size or "").lower()
        size_match = False
        if "small" in desired_size:
            size_match = plant_size == "small"
        elif "medium" in desired_size:
            size_match = plant_size == "medium"
        elif "large" in desired_size:
            size_match = plant_size == "large"
        if not size_match:
            print(f" {plant.name}: Size mismatch ({plant.size})")
            continue

        # 5. STYLE
        if style:
            plant_style = (plant.style or "").lower()
            if plant_style != style:
                print(f"{plant.name}: Style mismatch ({plant.style})")
                continue

        print(f"✅ {plant.name}: PERFECT MATCH")
        matched.append(plant)

    print("\n" + "=" * 60)
    print(f"TOTAL MATCHED: {len(matched)}")
    print("=" * 60)
    for plant in matched:
        print(
            f" {plant.name} | Light: {plant.light_requirement} | "
            f"Care: {plant.care_level} | Size: {plant.size} | "
            f"Style: {plant.style} | Pet Safe: {plant.is_pet_safe}"
        )

    return matched[:6]

def _extract_pet_bool(pet_value):
    if pet_value is None:
        return None
    if isinstance(pet_value, bool):
        return pet_value
    if isinstance(pet_value, dict):
        v = pet_value.get("value")
        if isinstance(v, bool):
            return v
        if isinstance(v, str):
            return v.lower() in ("yes", "true", "1")
    return None

@app.get("/api/plants/{plant_id}", response_model=PlantResponse)
def get_plant(plant_id: int, db: Session = Depends(get_db)):
    plant = db.query(Plant).filter(Plant.id == plant_id).first()

    if not plant:
        raise HTTPException(
            status_code=404,
            detail=f"Plant with id {plant_id} not found"
        )

    print(f"\n GET /api/plants/{plant_id} → {plant.name}")
    return plant

@app.get("/")
def read_root():
    return {"message": "Welcome to Leafly API"}



@app.get("/api/plants/", response_model=PaginatedPlants)
def get_plants(
    light: Optional[str] = None,
    size: Optional[str] = None,
    is_pet_safe: Optional[bool] = None,
    max_price: Optional[float] = None,
    care_level: Optional[str] = None,
    style: Optional[str] = None,
    category: Optional[str] = None,
    page:int =1,
    limit:int =9,
    db: Session = Depends(get_db),
    
    
):
    query = db.query(Plant)

    if light:
        l = light.lower().strip()
        if "low" in l:
            query = query.filter(Plant.light_requirement.ilike("%Low%"))
        elif "bright indirect" in l:
            query = query.filter(Plant.light_requirement.ilike("%Bright Indirect%"))
        elif "bright direct" in l or "full sun" in l:
            query = query.filter(Plant.light_requirement.ilike("%Bright Direct%"))
        elif "bright" in l:
            query = query.filter(Plant.light_requirement.ilike("%Bright%"))
        elif "medium" in l or "adaptable" in l:
            query = query.filter(Plant.light_requirement.ilike("%Adaptable%"))
        elif "indirect" in l:
            query = query.filter(Plant.light_requirement.ilike("%Indirect%"))
        else:
            query = query.filter(Plant.light_requirement.ilike(f"%{light}%"))

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

    page=max(page,1)
    limit=max(min(limit,100),1)

    return paginate(query,page,limit)


@app.post("/api/orders/", response_model=OrderResponse)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    if not order.items:
        raise HTTPException(400, "Order must have at least one item")

    subtotal = sum(item.price * item.quantity for item in order.items)
    discount = 24.0 if subtotal > 0 else 0
    shipping_fee = 8.0
    tax = 10.0
    total = subtotal - discount + shipping_fee + tax

    db_order = Order(
        user_email=order.user_email,
        total=total,
        status="paid",         
        shipping_name=order.shipping_name,
        shipping_phone=order.shipping_phone,
        shipping_address=order.shipping_address,
        shipping_city=order.shipping_city,
        shipping_zip=order.shipping_zip,
        shipping_country=order.shipping_country,
        payment_method=order.payment_method,
        payment_last4=order.payment_last4,
    )
    db.add(db_order)
    db.flush()     

    for item in order.items:
        db_item = OrderItem(
            order_id=db_order.id,
            plant_id=item.plant_id,
            plant_name=item.plant_name,
            price=item.price,
            quantity=item.quantity,
            subtotal=item.price * item.quantity,
        )
        db.add(db_item)

    db.commit()
    db.refresh(db_order)

    print(f"\n🎉 Order #{db_order.id} created — ${total:.2f}")
    return db_order



@app.get("/api/orders/", response_model=List[OrderResponse])
def get_orders(
    status: Optional[str] = None,
    email: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    query = db.query(Order)

    if status:
        query = query.filter(Order.status == status)
    if email:
        query = query.filter(Order.user_email == email)

    query = query.order_by(desc(Order.created_at))
    return query.offset(skip).limit(limit).all()



@app.get("/api/orders/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(404, "Order not found")
    return order



class StatusUpdate(BaseModel):
    status: str

@app.patch("/api/orders/{order_id}/status", response_model=OrderResponse)
def update_status(
    order_id: int,
    body: StatusUpdate,
    db: Session = Depends(get_db),
):
    valid = ["pending", "paid", "shipped", "delivered", "cancelled"]
    if body.status not in valid:
        raise HTTPException(400, f"Status must be one of {valid}")

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(404, "Order not found")

    order.status = body.status
    db.commit()
    db.refresh(order)
    return order


@app.get("/api/sales/summary", response_model=SalesSummary)
def sales_summary(db: Session = Depends(get_db)):
    total_orders = db.query(Order).count()

    total_revenue = db.query(func.sum(Order.total)).scalar() or 0

    total_items = db.query(func.sum(OrderItem.quantity)).scalar() or 0

    avg_order = total_revenue / total_orders if total_orders > 0 else 0

    pending = db.query(Order).filter(Order.status == "pending").count()
    paid = db.query(Order).filter(Order.status == "paid").count()
    delivered = db.query(Order).filter(Order.status == "delivered").count()

    return {
        "total_orders": total_orders,
        "total_revenue": round(total_revenue, 2),
        "total_items_sold": total_items,
        "avg_order_value": round(avg_order, 2),
        "pending_orders": pending,
        "paid_orders": paid,
        "delivered_orders": delivered,
    }



@app.get("/api/sales/top-plants")
def top_plants(limit: int = 5, db: Session = Depends(get_db)):
    results = (
        db.query(
            OrderItem.plant_id,
            OrderItem.plant_name,
            func.sum(OrderItem.quantity).label("total_sold"),
            func.sum(OrderItem.subtotal).label("revenue"),
        )
        .group_by(OrderItem.plant_id, OrderItem.plant_name)
        .order_by(desc("total_sold"))
        .limit(limit)
        .all()
    )

    return [
        {
            "plant_id": r.plant_id,
            "plant_name": r.plant_name,
            "total_sold": r.total_sold,
            "revenue": round(r.revenue, 2),
        }
        for r in results
    ]



@app.get("/api/sales/revenue")
def revenue_by_day(days: int = 30, db: Session = Depends(get_db)):
    since = datetime.utcnow() - timedelta(days=days)

    results = (
        db.query(
            func.date(Order.created_at).label("date"),
            func.count(Order.id).label("orders"),
            func.sum(Order.total).label("revenue"),
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
            "revenue": round(r.revenue or 0, 2),
        }
        for r in results
    ]



@app.get("/api/sales/by-status")
def by_status(db: Session = Depends(get_db)):
    results = (
        db.query(
            Order.status,
            func.count(Order.id).label("count"),
            func.sum(Order.total).label("revenue"),
        )
        .group_by(Order.status)
        .all()
    )

    return [
        {
            "status": r.status,
            "count": r.count,
            "revenue": round(r.revenue or 0, 2),
        }
        for r in results
    ]



@app.get("/api/sales/recent")
def recent_orders(limit: int = 10, db: Session = Depends(get_db)):
    orders = (
        db.query(Order)
        .order_by(desc(Order.created_at))
        .limit(limit)
        .all()
    )

    return [
        {
            "id": o.id,
            "email": o.user_email,
            "total": o.total,
            "status": o.status,
            "created_at": o.created_at.isoformat(),
            "items_count": len(o.items),
        }
        for o in orders
    ]


@app.post("/api/plant/", response_model=PaginatedPlants)
def filter_plants_post(
    filters: PlantFilterRequest,
    page:int=1,
    limit:int=6,
    db: Session = Depends(get_db),
):
    query = db.query(Plant)

  
    if filters.room_light:
        light = filters.room_light.lower().strip()
        if "low" in light:
            query = query.filter(Plant.light_requirement.ilike("%Low%"))
        elif "bright indirect" in light:
            query = query.filter(Plant.light_requirement.ilike("%Bright Indirect%"))
        elif "full sun" in light or "bright direct" in light:
            query = query.filter(Plant.light_requirement.ilike("%Bright Direct%"))
        elif "bright" in light:
            query = query.filter(Plant.light_requirement.ilike("%Bright%"))
        elif "medium" in light:
            query = query.filter(
                or_(
                    Plant.light_requirement.ilike("%Medium%"),
                    Plant.light_requirement.ilike("%Adaptable%"),
                )
            )

  
    if filters.size:
        db_sizes = []
        for s in filters.size:
            s_lower = s.lower()
            if "small" in s_lower:
                db_sizes.append("Small")
            elif "medium" in s_lower:
                db_sizes.append("Medium")
            elif "large" in s_lower:
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
            "advanced": "Expert",
        }
        db_care = [care_map.get(c.lower(), c) for c in filters.care_level]
        query = query.filter(Plant.care_level.in_(db_care))

   
    if filters.price is not None:
        query = query.filter(Plant.price <= filters.price)

    if filters.category:
        query = query.filter(Plant.category.in_(filters.category))

    page=max(page,1)
    limit=max(min(limit,100),1)

    results=paginate(query,page,limit)

    print("\n" + "=" * 60)
    print(" POST /api/plant/ — FILTERS")
    print("=" * 60)
    print(f"Light:      {filters.room_light}")
    print(f"Size:       {filters.size}")
    print(f"Pet:        {filters.pet_friendly} → {pet_bool}")
    print(f"Care:       {filters.care_level}")
    print(f"Price ≤:    {filters.price}")
    print(f"Category:   {filters.category}")
    print(f"Matched: {len(results)}")
    print("=" * 60)

    return results



@app.post("/api/plant-finder/", response_model=List[PlantResponse])
def plant_finder(
    selection: SelectionCreate,
    db: Session = Depends(get_db)
):
    selection_dict = selection.model_dump()
    print("\n==============================")
    print("PLANT FINDER REQUEST")
    print("==============================")
    print(selection_dict)

    matched = match_plants(selection_dict, db)

    print("\nMATCHED PLANTS:")
    for plant in matched:
        print(plant.name, "|", plant.light_requirement, "|",
              plant.care_level, "|", plant.size, "|",
              plant.style, "| Pet:", plant.is_pet_safe)

    return matched


@app.post("/api/plants/", response_model=PlantResponse)
def create_plant(plant: PlantCreate, db: Session = Depends(get_db)):
    db_plant = Plant(**plant.model_dump())
    db.add(db_plant)
    db.commit()
    db.refresh(db_plant)
    return db_plant


def seed_plants():
    db = SessionLocal()
    try:
        if db.query(Plant).count() == 0:
            print(" Seeding 20 default plants...")

            samples = [
                Plant(
                    name="Snake Plant", subtitle="Sansevieria trifasciata", price=24.00,
                    image_url="https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?auto=format&fit=crop&q=80&w=400&h=500",
                    light_requirement="Low Light", water_frequency="Every 2-3 weeks",
                    maintenance="Low Maintenance", is_pet_safe=True, size="Medium",
                    care_level="Beginner", style="Modern", category="Air Purifying",
                    description="Hardy air-purifying plant with upright sword-like leaves.",
                    sku="LD-SN-0001", dimensions="Height: 40–60 cm", origin="West Africa",
                    care_instructions="Watering: Every 2–3 weeks; let soil dry completely.\nLight: Tolerates low light but prefers bright, indirect.\nHumidity: Average household humidity.\nSoil: Well-draining cactus or succulent mix.",
                ),
                Plant(
                    name="Golden Pothos", subtitle="Epipremnum aureum", price=18.00,
                    image_url="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=400&h=500",
                    light_requirement="Adaptable Light", water_frequency="Weekly",
                    maintenance="Low Maintenance", is_pet_safe=False, size="Small",
                    care_level="Beginner", style="Bohemian", category="Tropical",
                    description="Trailing vine with heart-shaped leaves, very forgiving.",
                    sku="LD-PT-0002", dimensions="Height: 20–30 cm (trailing up to 1 m)", origin="French Polynesia",
                    care_instructions="Watering: Weekly; let top inch of soil dry.\nLight: Low to bright indirect.\nHumidity: Moderate to high.\nSoil: Standard well-draining potting mix.",
                ),
                Plant(
                    name="ZZ Plant", subtitle="Zamioculcas zamiifolia", price=29.00,
                    image_url="https://images.unsplash.com/photo-1632207691143-643e2a9a9361?auto=format&fit=crop&q=80&w=400&h=500",
                    light_requirement="Low Light", water_frequency="Every 2-3 weeks",
                    maintenance="Low Maintenance", is_pet_safe=True, size="Medium",
                    care_level="Beginner", style="Minimalist", category="Air Purifying",
                    description="Glossy waxy leaves, extremely drought tolerant.",
                    sku="LD-ZZ-0003", dimensions="Height: 45–70 cm", origin="East Africa",
                    care_instructions="Watering: Every 2–3 weeks; drought tolerant.\nLight: Low to bright indirect.\nHumidity: Any indoor humidity.\nSoil: Well-draining mix; avoid overwatering.",
                ),
                Plant(
                    name="Monstera Deliciosa", subtitle="Swiss Cheese Plant", price=45.00,
                    image_url="https://images.unsplash.com/photo-1614594895304-fe7116ac3b58?auto=format&fit=crop&q=80&w=400&h=500",
                    light_requirement="Bright Indirect", water_frequency="Weekly",
                    maintenance="Moderate", is_pet_safe=False, size="Large",
                    care_level="Moderate", style="Bohemian", category="Tropical",
                    description="Iconic split leaves, a tropical statement piece.",
                    sku="LD-MN-0004", dimensions="Height: 60–120 cm", origin="Southern Mexico",
                    care_instructions="Watering: Every 10–14 days; let top 2 inches dry.\nLight: Bright indirect; avoid direct sun.\nHumidity: Moderate to high; mist occasionally.\nSoil: Well-draining mix with perlite.",
                ),
                Plant(
                    name="Peace Lily", subtitle="Spathiphyllum wallisii", price=22.00,
                    image_url="https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?auto=format&fit=crop&q=80&w=400&h=500",
                    light_requirement="Low Light", water_frequency="Weekly",
                    maintenance="Moderate", is_pet_safe=False, size="Medium",
                    care_level="Moderate", style="Modern", category="Air Purifying",
                    description="Elegant white blooms, excellent air purifier.",
                    sku="LD-PL-0005", dimensions="Height: 40–70 cm", origin="Central America",
                    care_instructions="Watering: Weekly; keep soil lightly moist.\nLight: Low to medium indirect.\nHumidity: Prefers higher humidity.\nSoil: Rich, well-draining mix.",
                ),
                Plant(
                    name="Spider Plant", subtitle="Chlorophytum comosum", price=16.00,
                    image_url="https://images.unsplash.com/photo-1654973114441-66b2f856bcef?auto=format&fit=crop&w=688&q=80",
                    light_requirement="Bright Indirect", water_frequency="Weekly",
                    maintenance="Low Maintenance", is_pet_safe=True, size="Small",
                    care_level="Beginner", style="Minimalist", category="Air Purifying",
                    description="Pet-safe with arching striped leaves and baby plantlets.",
                    sku="LD-SP-0006", dimensions="Height: 20–40 cm", origin="Southern Africa",
                    care_instructions="Watering: Weekly; reduce in winter.\nLight: Bright, indirect.\nHumidity: Average indoor humidity.\nSoil: General-purpose potting mix.",
                ),
                Plant(
                    name="Fiddle Leaf Fig", subtitle="Ficus lyrata", price=55.00,
                    image_url="https://images.unsplash.com/photo-1597055181300-e3633a917c9c?auto=format&fit=crop&q=80&w=400&h=500",
                    light_requirement="Bright Indirect", water_frequency="Weekly",
                    maintenance="Moderate", is_pet_safe=False, size="Large",
                    care_level="Moderate", style="Modern", category="Tropical",
                    description="Statement tree with large violin-shaped leaves.",
                    sku="LD-FL-0007", dimensions="Height: 90–150 cm", origin="Western Africa",
                    care_instructions="Watering: Weekly; let top inch dry.\nLight: Bright indirect; rotate weekly.\nHumidity: Moderate; dislikes drafts.\nSoil: Well-draining, slightly acidic mix.",
                ),
                Plant(
                    name="Aloe Vera", subtitle="Aloe barbadensis miller", price=14.00,
                    image_url="https://images.unsplash.com/photo-1629426956597-1f94bac22333?auto=format&fit=crop&q=80&w=400&h=500",
                    light_requirement="Bright Direct", water_frequency="Every 2-3 weeks",
                    maintenance="Low Maintenance", is_pet_safe=False, size="Small",
                    care_level="Beginner", style="Minimalist", category="Succulents",
                    description="Succulent with soothing medicinal gel inside its leaves.",
                    sku="LD-AV-0008", dimensions="Height: 20–30 cm", origin="Arabian Peninsula",
                    care_instructions="Watering: Every 2–3 weeks; let soil dry fully.\nLight: Bright direct sunlight.\nHumidity: Dry air is fine.\nSoil: Cactus/succulent mix.",
                ),
                Plant(
                    name="Rubber Plant", subtitle="Ficus elastica", price=32.00,
                    image_url="https://images.unsplash.com/photo-1602923668104-8f9e03e77e62?auto=format&fit=crop&q=80&w=400&h=500",
                    light_requirement="Bright Indirect", water_frequency="Every 1-2 weeks",
                    maintenance="Moderate", is_pet_safe=False, size="Large",
                    care_level="Moderate", style="Modern", category="Tropical",
                    description="Bold burgundy-green glossy leaves on a tall trunk.",
                    sku="LD-RB-0009", dimensions="Height: 80–150 cm", origin="Southeast Asia",
                    care_instructions="Watering: Every 1–2 weeks; let top inch dry.\nLight: Bright indirect.\nHumidity: Moderate.\nSoil: Well-draining potting mix.",
                ),
                Plant(
                    name="Boston Fern", subtitle="Nephrolepis exaltata", price=20.00,
                    image_url="https://images.unsplash.com/photo-1606976120746-2289a18b474e?auto=format&fit=crop&q=80&w=400&h=500",
                    light_requirement="Bright Indirect", water_frequency="Every 2-3 days",
                    maintenance="Moderate", is_pet_safe=True, size="Medium",
                    care_level="Moderate", style="Bohemian", category="Tropical",
                    description="Lush feathery fronds, loves humidity.",
                    sku="LD-BF-0010", dimensions="Height: 40–60 cm", origin="Tropical Americas",
                    care_instructions="Watering: Every 2–3 days; keep soil moist.\nLight: Bright, indirect.\nHumidity: High; mist daily.\nSoil: Peat-based, moisture-retaining mix.",
                ),
                Plant(
                    name="Jade Plant", subtitle="Crassula ovata", price=18.00,
                    image_url="https://images.unsplash.com/photo-1741438059760-bf20d047bc19?auto=format&fit=crop&q=80&w=400&h=500",
                    light_requirement="Bright Direct", water_frequency="Every 2-3 weeks",
                    maintenance="Low Maintenance", is_pet_safe=False, size="Small",
                    care_level="Beginner", style="Modern", category="Succulents",
                    description="Succulent with coin-shaped leaves, symbol of prosperity.",
                    sku="LD-JD-0011", dimensions="Height: 20–40 cm", origin="South Africa",
                    care_instructions="Watering: Every 2–3 weeks; allow soil to dry fully.\nLight: Bright direct.\nHumidity: Low.\nSoil: Cactus/succulent mix.",
                ),
                Plant(
                    name="Calathea Orbifolia", subtitle="Goeppertia orbifolia", price=38.00,
                    image_url="https://images.unsplash.com/photo-1777428904692-0ded971bdde5?auto=format&fit=crop&q=80&w=400&h=500",
                    light_requirement="Bright Indirect", water_frequency="Weekly",
                    maintenance="Moderate", is_pet_safe=True, size="Medium",
                    care_level="Moderate", style="Bohemian", category="Tropical",
                    description="Striking silver-striped leaves that fold at night.",
                    sku="LD-CT-0012", dimensions="Height: 40–60 cm", origin="Bolivia",
                    care_instructions="Watering: Weekly; keep soil evenly moist.\nLight: Bright, indirect.\nHumidity: High; use a pebble tray.\nSoil: Moisture-retaining, well-draining mix.",
                ),
                Plant(
                    name="Philodendron Brasil", subtitle="Philodendron hederaceum", price=26.00,
                    image_url="https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?auto=format&fit=crop&q=80&w=400&h=500",
                    light_requirement="Bright Indirect", water_frequency="Weekly",
                    maintenance="Low Maintenance", is_pet_safe=False, size="Small",
                    care_level="Beginner", style="Bohemian", category="Tropical",
                    description="Trailing vine with variegated green and yellow leaves.",
                    sku="LD-PB-0013", dimensions="Height: 20–30 cm (trailing)", origin="Brazil",
                    care_instructions="Watering: Weekly; let top inch dry.\nLight: Bright indirect for best variegation.\nHumidity: Moderate.\nSoil: Well-draining potting mix.",
                ),
                Plant(
                    name="String of Pearls", subtitle="Senecio rowleyanus", price=22.00,
                    image_url="https://images.unsplash.com/photo-1765041425888-39e09e148a80?auto=format&fit=crop&q=80&w=400&h=500",
                    light_requirement="Bright Direct", water_frequency="Every 2-3 weeks",
                    maintenance="Moderate", is_pet_safe=False, size="Small",
                    care_level="Moderate", style="Bohemian", category="Succulents",
                    description="Trailing succulent with bead-like leaves.",
                    sku="LD-SOP-0014", dimensions="Trail length: 30–90 cm", origin="Southwest Africa",
                    care_instructions="Watering: Every 2–3 weeks; let soil dry fully.\nLight: Bright direct.\nHumidity: Low.\nSoil: Cactus/succulent mix.",
                ),
                Plant(
                    name="Bird of Paradise", subtitle="Strelitzia reginae", price=78.00,
                    image_url="https://images.unsplash.com/photo-1677787320811-14c81b24e828?auto=format&fit=crop&w=934&q=80",
                    light_requirement="Bright Direct", water_frequency="Weekly",
                    maintenance="Moderate", is_pet_safe=False, size="Large",
                    care_level="Moderate", style="Modern", category="Tropical",
                    description="Dramatic oversized leaves, tropical centrepiece.",
                    sku="LD-BOP-0015", dimensions="Height: 120–180 cm", origin="South Africa",
                    care_instructions="Watering: Weekly; let top inch dry.\nLight: Bright direct to bright indirect.\nHumidity: Moderate to high.\nSoil: Rich, well-draining mix.",
                ),
                Plant(
                    name="Chinese Money Plant", subtitle="Pilea peperomioides", price=20.00,
                    image_url="https://images.unsplash.com/photo-1598880940080-ff9a29891b85?auto=format&fit=crop&q=80&w=400&h=500",
                    light_requirement="Bright Indirect", water_frequency="Weekly",
                    maintenance="Low Maintenance", is_pet_safe=True, size="Small",
                    care_level="Beginner", style="Minimalist", category="Tropical",
                    description="Distinctive pancake-shaped leaves on thin stems.",
                    sku="LD-CMP-0016", dimensions="Height: 20–30 cm", origin="Southern China",
                    care_instructions="Watering: Weekly; let top inch dry.\nLight: Bright indirect.\nHumidity: Moderate.\nSoil: Well-draining potting mix.",
                ),
                Plant(
                    name="Anthurium", subtitle="Anthurium andraeanum", price=34.00,
                    image_url="https://images.unsplash.com/photo-1567748157439-651aca2ff064?auto=format&fit=crop&w=934&q=80",
                    light_requirement="Bright Indirect", water_frequency="Weekly",
                    maintenance="Moderate", is_pet_safe=False, size="Medium",
                    care_level="Moderate", style="Modern", category="Tropical",
                    description="Glossy heart-shaped leaves and long-lasting colorful flowers.",
                    sku="LD-AN-0017", dimensions="Height: 40–60 cm", origin="Colombia",
                    care_instructions="Watering: Weekly; let top inch dry.\nLight: Bright indirect.\nHumidity: High.\nSoil: Airy, well-draining orchid mix.",
                ),
                Plant(
                    name="Dracaena Marginata", subtitle="Dragon Tree", price=42.00,
                    image_url="https://images.unsplash.com/photo-1681009507502-d2c8d448b8fb?auto=format&fit=crop&w=934&q=80",
                    light_requirement="Low Light", water_frequency="Every 2-3 weeks",
                    maintenance="Low Maintenance", is_pet_safe=False, size="Large",
                    care_level="Beginner", style="Modern", category="Air Purifying",
                    description="Slim red-edged leaves on sculptural stems.",
                    sku="LD-DM-0018", dimensions="Height: 90–150 cm", origin="Madagascar",
                    care_instructions="Watering: Every 2–3 weeks.\nLight: Low to bright indirect.\nHumidity: Average indoor.\nSoil: Well-draining potting mix.",
                ),
                Plant(
                    name="Areca Palm", subtitle="Dypsis lutescens", price=48.00,
                    image_url="https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=934&q=80",
                    light_requirement="Bright Indirect", water_frequency="Weekly",
                    maintenance="Moderate", is_pet_safe=True, size="Large",
                    care_level="Moderate", style="Bohemian", category="Air Purifying",
                    description="Feathery fronds, natural air humidifier.",
                    sku="LD-AP-0019", dimensions="Height: 120–180 cm", origin="Madagascar",
                    care_instructions="Watering: Weekly; keep soil lightly moist.\nLight: Bright indirect.\nHumidity: High.\nSoil: Well-draining palm mix.",
                ),
                Plant(
                    name="Haworthia", subtitle="Haworthiopsis attenuata", price=12.00,
                    image_url="https://images.unsplash.com/photo-1450930099855-f1695a727df5?auto=format&fit=crop&q=80&w=400&h=500",
                    light_requirement="Bright Indirect", water_frequency="Every 3 weeks",
                    maintenance="Low Maintenance", is_pet_safe=True, size="Small",
                    care_level="Beginner", style="Minimalist", category="Succulents",
                    description="Small succulent with distinctive white zebra stripes.",
                    sku="LD-HW-0020", dimensions="Height: 10–15 cm", origin="South Africa",
                    care_instructions="Watering: Every 3 weeks; allow soil to dry.\nLight: Bright indirect.\nHumidity: Low.\nSoil: Cactus/succulent mix.",
                ),
            ]

            db.add_all(samples)
            db.commit()
            print(f" Seeded {len(samples)} plants.")
        else:
            print(f"ℹ {db.query(Plant).count()} plants already in database.")
    finally:
        db.close()


def main():
    print("=" * 60)
    print("LEAFLY API")
    print("=" * 60)
    print(f"Database: {DB_NAME} @ {DB_HOST}:{DB_PORT}")
    print(f"User: {DB_USER}")

    print("\n Creating tables (auto)...")
    Base.metadata.create_all(bind=engine)
    print(" Tables ready.")

    seed_plants()

    print("\n Menu:")
    print("   1. Start API server (http://127.0.0.1:8000)")
    print("   2. View all plants in terminal")
    print("   3. Exit")

    try:
        choice = input("\n Choose (1-3): ").strip()

        if choice == "1":
            print("\n Starting FastAPI server...")
            print("Docs: http://127.0.0.1:8000/docs")
            print("Press CTRL+C to stop\n")
            uvicorn.run(app, host="127.0.0.1", port=8000)

        elif choice == "2":
            db = SessionLocal()
            try:
                plants = db.query(Plant).all()
                print("\n" + "=" * 90)
                print(f"{'ID':<4} {'Name':<22} {'Price':<8} {'Light':<18} {'Category':<16} {'Pet Safe':<10}")
                print("-" * 90)
                for p in plants:
                    print(f"{p.id:<4} {p.name:<22} ${p.price:<7} {p.light_requirement:<18} "
                          f"{(p.category or '-'):<16} {'✅' if p.is_pet_safe else '❌':<10}")
                print("=" * 90)
                print(f"🌱 Total: {len(plants)} plants")
            finally:
                db.close()

        elif choice == "3":
            print("\n  Goodbye!")
        else:
            print("  Invalid choice.")

    except KeyboardInterrupt:
        print("\n\n Server stopped.")
    except Exception as e:
        print(f"\n  Error: {e}")


if __name__ == "__main__":
    main()