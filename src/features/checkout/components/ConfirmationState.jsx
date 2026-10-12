import { Check } from 'lucide-react'
import React, { useEffect } from 'react'
import Button from '../../../components/Button'
import { Link } from 'react-router-dom'

const ConfirmationState = ({
  order,
  onContinueShopping,
  onViewOrder,
  
}) => {
  const orderId = order?.id ? `LD-${String(order.id).padStart(5, '0')}` : 'LD-00000'
  const placedAt = order?.created_at
  ? new Date(order.created_at).toLocaleString('my-MM', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  : 'မကြာမီ'

  const email = order?.user_email || 'your email'
  const total =order?.total || 0.00
  const city = order?.shipping_city || 'your address'

  const estimatedDate = new Date()
  estimatedDate.setDate(estimatedDate.getDate() + 3)
  const estimated = estimatedDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  

  return (
    <div className="pt-14">
      <div className="flex items-start gap-6 bg-white p-8 rounded-2xl">
        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
          <Check className="text-white w-6 h-6" />
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-medium text-gray-900 mb-2">
            Thank you! Your order is confirmed.
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            Order #{orderId} · Placed {placedAt}
          </p>

          <div className="grid grid-cols-2 gap-8 mb-8">
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
                ${Number(total).toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
                Shipping to
              </p>
              <p className="text-sm font-medium">{city}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
                Need help?
              </p>
              <Button text="View plant care guide" variant="secondaryDark" />
            </div>
          </div>

          <div className="flex gap-4">
            <Link to="/shop">
            <Button
              variant="dark"
              text="Continue shopping"
              
              onClick={onContinueShopping}
              
            />
            </Link>
            <Button
              variant="secondaryDark"
              text="View order details"
              onClick={onViewOrder}
            />
          </div>

          {/* ⭐ Dynamic email */}
          <p className="text-[10px] text-gray-400 mt-6">
            A confirmation email has been sent to {email}. If you have
            questions, visit our help center or contact support. Responsible
            packaging with recyclable materials.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationState