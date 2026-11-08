import { Check } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Button from '../../../components/Button'
import { Link } from 'react-router-dom'
import useCookie from 'react-use-cookie'

const ConfirmationState = ({
  onContinueShopping,
  onViewOrder,
  order_Id
}) => {
  const [order,setOrder]=useState([])
  

  const [token]=useCookie("token");

  const placedAt = order?.created_at
    ? new Date(order.created_at).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Recently'

    console.log(order_Id);
    

  useEffect(() => {
  const fetchOrder = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/orders/${Number(order_Id)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      

      if (res.ok) {
        setOrder(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  fetchOrder();
}, [order_Id, token]);

useEffect(() => {
  console.log("Updated order:", order);
}, [order]);
  

  const email = order?.user_email || 'your email'
  const total = Number(order?.total ?? order?.total_amount ?? 0)
  const city = order?.shipping_city || 'your address'

  const estimatedDate = new Date()
  estimatedDate.setDate(estimatedDate.getDate() + 3)

  const estimated = estimatedDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="pt-8 sm:pt-14 px-3 sm:px-0">
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 bg-white p-5 sm:p-8 rounded-2xl">

        <div className="w-11 h-11 sm:w-12 sm:h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
          <Check className="text-white w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        <div className="flex-1 min-w-0 w-full">

          <h2 className="text-xl sm:text-2xl font-medium text-gray-900 mb-2">
            Thank you! Your order is confirmed.
          </h2>

          <p className="text-xs sm:text-sm text-gray-500 mb-6 break-words">
            Order #{order.order_number} · Placed {placedAt}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8 mb-8">

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
                Estimated delivery
              </p>
              <p className="text-sm font-medium">
                {estimated} — Afternoon
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
                Order total
              </p>
              <p className="text-sm font-medium">
                ${total.toFixed(2)}
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
                Shipping to
              </p>
              <p className="text-sm font-medium break-words">
                {city}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
                Need help?
              </p>
              <Button
                text="View plant care guide"
                variant="secondaryDark"
              />
            </div>

          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto"
              onClick={onContinueShopping}
            >
              <Button
                variant="dark"
                text="Continue shopping"
              />
            </Link>

            <Link to={`/my-orders/${order_Id}`}>
            <Button
              variant="secondaryDark"
              text="View order details"
              onClick={onViewOrder}
            />
            </Link>

            
          </div>

          <p className="text-[10px] sm:text-xs text-gray-400 mt-6 leading-relaxed break-words">
            A confirmation email has been sent to {email}.
            If you have questions, visit our help center or contact support.
            Responsible packaging with recyclable materials.
          </p>

        </div>
      </div>
    </div>
  )
}

export default ConfirmationState