import React from 'react'

const OrderItem = ({ item }) => {
  return (
    <div className="flex items-start justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="flex gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover mix-blend-multiply"
          />
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
          <p className="text-xs text-gray-400 mt-1">Qty: {item.quantity}</p>
        </div>
      </div>
      <span className="text-sm font-medium text-gray-900">
        ${(item.price * item.quantity).toFixed(2)}
      </span>
    </div>
  )
}

export default OrderItem