import React, { useState } from 'react'
import Container from '../../../components/Container'
import Stepper from '../components/Stepper'
import ShippingSection from '../components/ShippingSection'
import PaymentSection from '../components/PaymentSection'
import Review_PlaceOrderSection from '../components/Review_PlaceOrderSection'
import ConfirmationState from '../components/ConfirmationState'
import { useLocation } from 'react-router-dom'

const CheckoutPage = () => {
  const location = useLocation();

  const [order,setOrder]=useState([]);

  const [step, setStep] = useState(1)

  const [shippingData, setShippingData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    apt: '',
    city: '',
    state: 'Oregon',
    zip: '',
    delivery: 'Leave at door',
    dateTime: 'Morning',
    saveAddress: false,
  })

  // ⭐ Payment data
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  })


 
  const [items] = useState(() => {
    if (location.state?.cartItems?.length > 0) {
      return location.state.cartItems;
    }
    const saved = localStorage.getItem('leafly_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discount = subtotal > 0 ? 24.00 : 0;
  const shipping = 8.00;
  const tax = 10.00;
  const total = subtotal - discount + shipping + tax;

  const handleShippingNext = (data) => {
    console.log('📍 Shipping complete:', data)
    setShippingData(data)
    setStep(2)
  }

  const handlePaymentNext = (data) => {
    console.log('📍 Payment complete:', data)
    setPaymentData(data)
    setStep(3)
  }

  const handlePlaceOrder = () => {
    setStep(4)
  }


  return (
    <Container>
      <div className="grid grid-cols-7 py-10">
        <div className="col-span-1"></div>
        <div className="col-span-5 bg-surface p-14 rounded-2xl">
          <Stepper currentStep={step}/>
          {
            step ===1 && (
              <ShippingSection 
              initialData={shippingData}
              onNext={handleShippingNext}
              />
            )
          }
          {
            step === 2 && (
              <PaymentSection 
              initialData={paymentData}
              onNext={handlePaymentNext}
              onBack={()=>setStep(1)}
              />
            ) 
          }
          {
            step === 3 && (
              <Review_PlaceOrderSection items={items} subtotal={subtotal} discount={discount} shipping={shipping} 
              tax={tax} total={total} 
              shippingData={shippingData}
              paymentData={paymentData}
              onBack={()=>setStep(2)}
              onPlaceOrder={handlePlaceOrder}
              setOrder={setOrder}
              />
              
            )
          }
          {
            step === 4 && (
               <ConfirmationState order={order}/>
            )
          }
         
        </div>
      </div>
    </Container>
  )
}

export default CheckoutPage