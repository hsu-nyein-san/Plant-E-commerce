import { Lock } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import useCookie from 'react-use-cookie';

const OrderSummary = ({ subtotal, discount = 0, tax = 0, cartItems = [] ,promoCode}) => {

  const [token]=useCookie("token");
  const [shippingCost, setShippingCost] = useState(8.00);
  const finalTotal = subtotal - (promoCode ? discount : 0) + shippingCost + tax;
  
const [isGuest, setIsGuest] = useState(false);
const navigate = useNavigate();


  

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 sticky top-24">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Order summary</h2>

      <div className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-700">
            {
              promoCode ? (<div>
                <span>Promo ({promoCode})</span><span>-${discount.toFixed(2)}</span>
              </div>) : (<></>)
            }
            
          </div>
        )}

        <div className="border-t border-gray-200 my-4 pt-4">
          <p className="text-xs font-medium text-gray-900 mb-2">Shipping</p>
          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs text-gray-600 cursor-pointer">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="shipping"
                  checked={shippingCost === 8}
                  onChange={() => setShippingCost(8)}
                  className="accent-black"
                />
                <span>Standard (3-5 business days)</span>
              </div>
              <span>$8.00</span>
            </label>
            <label className="flex items-center justify-between text-xs text-gray-600 cursor-pointer">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="shipping"
                  checked={shippingCost === 18}
                  onChange={() => setShippingCost(18)}
                  className="accent-black"
                />
                <span>Expedited (1-2 business days)</span>
              </div>
              <span>$18.00</span>
            </label>
          </div>
        </div>

        <div className="border-t border-gray-200 my-4 pt-4 flex justify-between">
          <span className="text-gray-600">Estimated tax</span>
          <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t border-gray-200 mt-6 pt-6 mb-6">
        <div className="flex justify-between items-center text-lg font-medium text-gray-900">
          <span>Total</span>
          <span>${finalTotal.toFixed(2)}</span>
        </div>
      </div>

      <Link to={!token ? (isGuest ? `/checkout` : `/login`) : `/checkout`} state={{ cartItems }}>
        <button className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition mb-4">
          Proceed to Checkout
        </button>
      </Link>

      <div className="flex items-center gap-2 text-xs text-gray-500 justify-center mb-6">
        <input type="checkbox" checked={isGuest} onChange={(e) => setIsGuest(e.target.checked)} id="guest" className="accent-black" />
        <label htmlFor="guest">Guest checkout (No account required)</label>
      </div>

      <div className="bg-white p-3 rounded border border-gray-200 text-xs text-gray-600 flex gap-2">
        <Lock size={14} className="text-green-600 flex-shrink-0" />
        <p>Safe plant packing: We guarantee safe packaging and insured transit for all live plants.</p>
      </div>
    </div>
  )
}

export default OrderSummary