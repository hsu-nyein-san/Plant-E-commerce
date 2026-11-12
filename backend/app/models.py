
from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import relationship

from .database import Base


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
    category = Column(String(50))
    description = Column(Text)

    sku = Column(String(50))
    dimensions = Column(String(100))
    origin = Column(String(100))
    care_instructions = Column(Text)

    created_at = Column(
        DateTime,
        nullable=False,
        server_default=func.current_timestamp()
    )

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(200), unique=True, index=True, nullable=False)
    full_name = Column(String(200), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)

    profile_image = Column(String(500), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    addresses = relationship(
        "Address",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    orders = relationship("Order", back_populates="user")


class WishList(Base):
    __tablename__ = "wishlist"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "plant_id",
            name="uq_wishlist_user_plant"
        ),
    )

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    plant_id = Column(
        Integer,
        ForeignKey("plants.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")
    plant = relationship("Plant")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(
        String(30),
        unique=True,
        index=True,
        nullable=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    user_email = Column(String(200), index=True)
    total = Column(Float, default=0)

    status = Column(String(50), default="pending", index=True)
    order_status = Column(String(50), default="pending")

    shipping_name = Column(String(200))
    shipping_phone = Column(String(50))
    shipping_address = Column(String(300))
    shipping_city = Column(String(100))
    shipping_zip = Column(String(20))
    shipping_country = Column(String(100), default="Myanmar")

    payment_method = Column(String(50))
    payment_last4 = Column(String(4))

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        index=True
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    items = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan"
    )

    user = relationship("User", back_populates="orders")

    payments = relationship(
        "Payment",
        back_populates="order",
        cascade="all, delete-orphan"
    )

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)

    order_id = Column(
        Integer,
        ForeignKey("orders.id"),
        index=True
    )

    plant_id = Column(
        Integer,
        ForeignKey("plants.id"),
        index=True
    )

    plant_name = Column(String(200))
    image_url = Column(String(500), nullable=True)
    category = Column(String(100), nullable=True)

    price = Column(Float)
    quantity = Column(Integer, default=1)
    subtotal = Column(Float)

    order = relationship("Order", back_populates="items")

class Address(Base):
    __tablename__ = "addresses"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    recipient_name = Column(String(200), nullable=False)
    phone = Column(String(50), nullable=False)

    address_line = Column(String(255), nullable=False)
    apt = Column(String(100), nullable=True)
    city = Column(String(100), nullable=False)
    region = Column(String(100), nullable=False)
    postal_code = Column(String(20), nullable=True)

    is_default = Column(Boolean, default=False, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="addresses")



class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)

    order_id = Column(
        Integer,
        ForeignKey("orders.id"),
        nullable=False,
        index=True
    )

    invoice_no = Column(
        String(50),
        unique=True,
        index=True
    )

    amount = Column(Float, nullable=False)

    currency = Column(String(10), default="SGD")
    payment_method = Column(String(50), default="2CP")

    status = Column(
        String(50),
        default="pending",
        index=True
    )

    transaction_id = Column(String(100), nullable=True)
    payment_token = Column(String(1000), nullable=True)
    response_code = Column(String(20), nullable=True)

    response_description = Column(
        String(500),
        nullable=True
    )

    web_payment_url = Column(String(1000), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    order = relationship("Order", back_populates="payments")


class CheckoutDraft(Base):
    __tablename__ = "checkout_drafts"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False,
        index=True
    )

    draft_data = Column(JSON, nullable=False, default=dict)

    created_at = Column(DateTime, default=datetime.utcnow)
