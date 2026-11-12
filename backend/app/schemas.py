
from datetime import datetime
from typing import List, Optional, Union

from pydantic import (
    BaseModel,
    EmailStr,
    Field,
    field_validator,
    ConfigDict,
)

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


class PlantResponse(PlantCreate):
    id: int

    class Config:
        from_attributes = True


class PlantFilterRequest(BaseModel):
    room_light: Optional[str] = None
    size: Optional[List[str]] = None
    pet_friendly: Optional[Union[bool, dict]] = None
    care_level: Optional[List[str]] = None
    price: Optional[float] = None
    category: Optional[List[str]] = None


class SelectionCreate(BaseModel):
    room_light: str
    has_pets: bool
    care_commitment: str
    desired_size: str
    style_preference: str


class OrderItemCreate(BaseModel):
    plant_id: int
    plant_name: str
    image_url: Optional[str] = None
    category: Optional[str] = None
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
    image_url: Optional[str] = None
    category: Optional[str] = None
    price: float
    quantity: int
    subtotal: float

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    order_number: Optional[str] = None
    user_id: int
    user_email: Optional[str] = None
    total: float
    status: str
    order_status: str

    shipping_name: Optional[str] = None
    shipping_phone: Optional[str] = None
    shipping_address: Optional[str] = None
    shipping_city: Optional[str] = None
    shipping_zip: Optional[str] = None
    shipping_country: Optional[str] = None

    payment_method: Optional[str] = None
    payment_last4: Optional[str] = None

    created_at: datetime
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True


class StatusUpdate(BaseModel):
    status: str

class WishlistItemCreate(BaseModel):
    plant_id: int


class WishlistItemResponse(BaseModel):
    id: int
    plant_id: int
    created_at: datetime
    plant: PlantResponse

    class Config:
        from_attributes = True


class UserSignup(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=200)
    password: str = Field(..., min_length=6, max_length=100)
    phone: Optional[str] = None

    @field_validator("full_name")
    @classmethod
    def name_not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("full_name cannot be blank")
        return v.strip()


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    profile_image: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class UpdateProfile(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=200)
    phone: Optional[str] = None


class ChangePassword(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=6, max_length=100)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse

class PaginatedPlants(BaseModel):
    items: List[PlantResponse]
    total: int
    page: int
    limit: int
    pages: int
    has_next: bool
    has_prev: bool


class BestSellerResponse(PlantResponse):
    total_sold: int


class PaginatedBestSellers(BaseModel):
    items: List[BestSellerResponse]
    total: int
    page: int
    limit: int
    pages: int
    has_next: bool
    has_prev: bool

class SalesSummary(BaseModel):
    total_orders: int
    total_revenue: float
    total_items_sold: int
    avg_order_value: float
    pending_orders: int
    paid_orders: int
    delivered_orders: int


class AddressBase(BaseModel):
    recipient_name: str
    phone: str
    address_line: str
    apt: Optional[str] = None
    city: str
    region: str
    postal_code: Optional[str] = None
    is_default: bool = False


class AddressCreate(AddressBase):
    pass


class AddressUpdate(BaseModel):
    recipient_name: Optional[str] = None
    phone: Optional[str] = None
    address_line: Optional[str] = None
    apt: Optional[str] = None
    city: Optional[str] = None
    region: Optional[str] = None
    postal_code: Optional[str] = None
    is_default: Optional[bool] = None


class AddressResponse(AddressBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
