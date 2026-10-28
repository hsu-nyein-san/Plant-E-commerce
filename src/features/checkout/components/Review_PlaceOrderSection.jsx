import React from 'react'
import OrderItem from './OrderItem'
import SectionHeader from './SectionHeader'
import useCookie from 'react-use-cookie';
import toast from 'react-hot-toast';

const Review_PlaceOrderSection = ({ items = [] ,shippingData={} ,paymentData={} ,onBack,onPlaceOrder,setOrder }) => {
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discount = subtotal > 0 ? 24.00 : 0;
  const shipping = 8.00;
  const tax = 10.00;
  const total = subtotal - discount + shipping + tax;

  const [token]=useCookie("token");

  console.log(items);
  

  const handlePlaceOrder=async ()=>{
    if (token)
    {
      try {
      const payload = {
      user_email: shippingData.email,
      shipping_name: shippingData.fullName,
      shipping_phone: shippingData.phone,
      shipping_address: shippingData.address,
      shipping_city: shippingData.city,
      shipping_zip: shippingData.zip,
      shipping_country: shippingData.country || 'Myanmar',
      payment_method: paymentData.method || 'Card',
      payment_last4: paymentData.cardNumber
        ? paymentData.cardNumber.replace(/\D/g, '').slice(-4)
        : null,
      items: items.map((item) => ({
        plant_id: item.id,
        plant_name: item.name,
        image_url:item.image,
        category:item.category,
        price: item.price,
        quantity: item.quantity,
      })),
    }

    const res=await fetch(`http://127.0.0.1:8000/api/orders/`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        Authorization:`Bearer ${token}`
      },
      body:JSON.stringify(payload),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.detail || `HTTP ${res.status}`)
    }

    const order=await res.json();

    localStorage.removeItem('leafly_cart')

    console.log(localStorage.getItem("checkout_draft"));
    
    if(localStorage.getItem("checkout_draft") != null)
    {
      localStorage.removeItem("checkout_draft")
      toast.success("delete local storage")
      
    }
    else
    {
      const res2=await fetch('http://127.0.0.1:8000/api/checkout-draft',
      {
        method:'DELETE',
        headers:{
          Authorization : `Bearer ${token}`,
        }
      }
    )

    const result=await res2.json();

    if(res2.ok)
    {
      toast.success(result.message)
    }
    }

    


    onPlaceOrder();
    setOrder(order)

    } catch (error) {
      console.log(error.message);
      
    }
    }
  }

  return (
    <div className=''>
      <SectionHeader
        number="3"
        title="Review & Place Order"
        subtitle="Confirm items, discounts, delivery and totals before placing your order."
      />

      <div className="space-y-6">
        <div className="border-t border-b border-gray-100 py-2">
          {items.length > 0 ? (
            items.map((item) => (
              <OrderItem key={item.id} item={item} />
            ))
          ) : (
            <p className="text-sm text-gray-500 py-4 text-center">No items in cart.</p>
          )}
        </div>

        {/* Totals */}
        <div className="space-y-3 text-sm">
          {discount > 0 && (
            <div className="flex justify-between text-gray-500">
              <span>Promo applied</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-500">
            <span>Delivery (Standard)</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Estimated tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Delivery date</span>
            <span className="text-gray-900">Thu, Sep 30 — Afternoon</span>
          </div>
          <div className="flex justify-between font-medium text-lg pt-4 border-t border-gray-100">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6">
          <div className="flex gap-6 text-[10px] text-gray-500 uppercase tracking-wider font-medium">
            <span>Secure checkout</span>
            <span>Money-back guarantee</span>
            <span>We use recyclable packaging</span>
          </div>
          <button onClick={()=>handlePlaceOrder()} className="px-8 py-3 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors shadow-lg">
            Place order
          </button>
        </div>
      </div>
    </div>
  )
}

export default Review_PlaceOrderSection