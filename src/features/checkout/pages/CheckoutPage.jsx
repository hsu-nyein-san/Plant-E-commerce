
import React, { useEffect, useState } from 'react'
import Container from '../../../components/Container'
import Stepper from '../components/Stepper'
import ShippingSection from '../components/ShippingSection'
import PaymentSection from '../components/PaymentSection'
import Review_PlaceOrderSection from '../components/Review_PlaceOrderSection'
import ConfirmationState from '../components/ConfirmationState'
import { useLocation } from 'react-router-dom'
import useCookie from 'react-use-cookie'

const CheckoutPage = () => {
  const location = useLocation()

  const [token] = useCookie("token");

  const [orderId,setOrderId] = useState();

  const isPaymentReturn = location.pathname === "/payment/return"

  

useEffect(() => {
  if (!isPaymentReturn) return;

  const verifyPayment = async () => {
    const params = new URLSearchParams(location.search);
    const invoiceNo = params.get("invoiceNo");
    const respCode = params.get("respCode");

    if (!invoiceNo) {
      console.error("Invoice number not found");
      return;
    }

    if (respCode !== "2000") {
      console.error("Payment unsuccessful:", respCode);
      return;
    }

    

    if (!token || token.split(".").length !== 3) {
      console.error("Invalid or missing JWT token");
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/payments/verify/${encodeURIComponent(invoiceNo)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      setOrderId(result.order?.id)

      console.log(result);
      

      if (!res.ok) {
        throw new Error(result.detail || "Payment verification failed");
      }


      if (result.status?.toLowerCase() === "paid") {
        localStorage.removeItem("leafly_cart");
        localStorage.removeItem("checkout_draft");

        window.dispatchEvent(new Event("cartUpdated"));

        
        setStep(4);
      } else {
        console.error("Payment is not marked as successful in database.");
      }

    } catch (error) {
      console.error("Payment verification error:", error);
    }
  };

  verifyPayment();

}, [isPaymentReturn, location.search, token]);


  const [order, setOrder] = useState([])
  const [step, setStep] = useState(isPaymentReturn ? 4 : 1)

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

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  })

  console.log(order);
  

  const [items] = useState(() => {
    if (location.state?.cartItems?.length > 0) {
      return location.state.cartItems
    }

    const saved = localStorage.getItem('leafly_cart')
    return saved ? JSON.parse(saved) : []
  })

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  const discount = subtotal > 0 ? 24.00 : 0
  const shipping = 8.00
  const tax = 10.00
  const total = subtotal - discount + shipping + tax

  const handleShippingNext = (data) => {
    setShippingData(data)
    setStep(2)
  }

  const handlePaymentNext = (data) => {
    setPaymentData(data)
    setStep(3)
  }

  const handlePlaceOrder = () => {
    setStep(4)
  }

  return (
    <Container>
      <div className="w-full py-6 sm:py-8 lg:py-10">
        <div className="mx-auto w-full max-w-5xl">
          <div className="w-full rounded-xl bg-surface p-4 sm:p-6 md:p-8 lg:p-12 xl:p-14">

            <Stepper currentStep={step} />

            {step === 1 && (
              <ShippingSection
                initialData={shippingData}
                onNext={handleShippingNext}
              />
            )}

            {step === 2 && (
              <PaymentSection
                initialData={paymentData}
                onNext={handlePaymentNext}
                onBack={() => setStep(1)}
              />
            )}

            {step === 3 && (
              <Review_PlaceOrderSection
                items={items}
                subtotal={subtotal}
                discount={discount}
                shipping={shipping}
                tax={tax}
                total={total}
                shippingData={shippingData}
                paymentData={paymentData}
                onBack={() => setStep(2)}
                onPlaceOrder={handlePlaceOrder}
                setOrder={setOrder}
              />
            )}

            {step === 4 && (
              <ConfirmationState order={order} order_Id={orderId}/>
            )}

          </div>
        </div>
      </div>
    </Container>
  )
}

export default CheckoutPage
