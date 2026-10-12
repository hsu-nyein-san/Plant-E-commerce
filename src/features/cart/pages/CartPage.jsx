import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from '../../../components/Container';
import YourCartSection from '../components/YourCartSection';
import PromoCode from '../components/PromoCode';
import ShippingEstimator from '../components/ShippingEstimator';
import OrderSummary from '../components/OrderSummary';

const CartPage = () => {
  // 1. Try to load cart from localStorage first, otherwise use default items
  // const defaultItems=localStorage.getItem('leafly_cart')

  

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('leafly_cart');
    return saved ? JSON.parse(saved) : defaultItems;
  });

  // 2. Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('leafly_cart', JSON.stringify(items));
  }, [items]);

  const updateQuantity = (id, delta) => {
    setItems(items.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  }

  const removeItem = (id) => setItems(items.filter(item => item.id !== id));

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discount = subtotal > 0 ? 24.00 : 0;
  const tax = 10.00;

  return (
    <Container>
        <div className="grid grid-cols-11 py-10 gap-8">
            <div className="col-span-6">
                <YourCartSection items={items} updateQuantity={updateQuantity} removeItem={removeItem}/>
                <div className="grid lg:grid-cols-2 gap-4">
                    <div className="col-span-1"><PromoCode /></div>
                    <div className="col-span-1"><ShippingEstimator/></div>
                </div>
            </div>
            <div className="col-span-5">
                <OrderSummary subtotal={subtotal} discount={discount} tax={tax} cartItems={items} />
            </div>
        </div>
    </Container>
  )
}
export default CartPage