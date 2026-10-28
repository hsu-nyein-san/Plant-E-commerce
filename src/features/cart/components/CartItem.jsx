import { Minus, Plus } from 'lucide-react'
import React from 'react'

const CartItem = ({ item, updateQuantity, removeItem }) => {
  return (
    <div className="flex gap-6 py-6 border-b border-gray-100 last:border-0">
      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{item.description}</p>
            </div>
            <button 
              onClick={() => removeItem(item.id)}
              className="text-red-500 text-xs hover:text-red-700 font-medium"
            >
              Remove
            </button>
          </div>
        </div>

        <div className="flex justify-between items-end mt-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center border border-gray-300 rounded w-fit">
              <button 
                onClick={() => updateQuantity(item.id, -1)}
                className="px-2 py-1 hover:bg-gray-50 text-gray-600 disabled:opacity-50"
                disabled={item.quantity <= 1}
              >
                <Minus size={12} />
              </button>
              <span className="px-3 text-sm font-medium w-8 text-center">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, 1)}
                className="px-2 py-1 hover:bg-gray-50 text-gray-600"
              >
                <Plus size={12} />
              </button>
            </div>
            {/* Delivery Info */}
            <span className="text-xs text-gray-400">{item.delivery}</span>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItem