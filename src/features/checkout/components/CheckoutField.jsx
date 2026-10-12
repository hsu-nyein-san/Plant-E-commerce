import React from 'react'
import { forwardRef } from 'react'

const CheckoutField = forwardRef(({ label, placeholder, type = "text", optional = false, className = "",error,...rest },ref) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-sm text-gray-600 font-medium">
      {label} {optional && <span className="text-gray-400 font-normal">(Optional)</span>}
    </label>
    <input 
      type={type}
      ref={ref}
      {...rest}
      placeholder={placeholder}
      className={`w-full bg-gray-50 border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-black ${
            error ? 'border-red-500' : 'border-gray-200'
          }`}
          
    />
    {error && <p className="text-red-500 text-xs">{error}</p>}

  </div>

  )
})

export default CheckoutField