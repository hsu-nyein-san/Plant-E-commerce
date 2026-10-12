import React from 'react'

const ShippingEstimator = () => {
  return (
    <div className="mt-8 border border-gray-200 rounded-lg p-4 bg-gray-50">
      <h4 className="text-sm font-medium text-gray-900 mb-3">Estimate shipping</h4>
      <p className="text-xs text-gray-500 mb-3">Calculate shipping to your delivery address</p>
      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder="Zip code" 
          className="w-24 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
        />
        <button className="bg-black text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-800">
          Calculate
        </button>
      </div>
    </div>

  )
}

export default ShippingEstimator