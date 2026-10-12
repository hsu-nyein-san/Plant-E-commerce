import React from 'react'

const PromoCode = () => {
  return (
    <div className="mt-8 border border-gray-200 rounded-lg p-4 bg-gray-50">
      <h4 className="text-sm font-medium text-gray-900 mb-3">Promo code</h4>
      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder="Enter promo code" 
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
        />
        <button className="bg-black text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-800">
          Apply
        </button>
      </div>
      <p className="text-xs text-red-500 mt-2 font-medium">
        Promo code "SPRING20" applied - 20% (valid)
      </p>
    </div>

  )
}

export default PromoCode