import React, { forwardRef } from 'react'

const RadioOption = forwardRef(({ label, name, defaultChecked,value,...rest },ref) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
    <div className="relative flex items-center justify-center">
      <input type="radio" name={name} defaultChecked={defaultChecked} className="peer sr-only" value={value} {...rest}/>
      <div className="w-5 h-5 rounded-full border border-gray-300 peer-checked:border-black peer-checked:bg-black transition-all"></div>
      <div className="absolute w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity"></div>
    </div>
    <span className="text-sm text-gray-700 group-hover:text-black">{label}</span>
  </label>

  )
})
RadioOption.displayName = 'RadioOption'
export default RadioOption