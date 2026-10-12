import React from 'react'

const SectionHeader = ({ number, title, subtitle }) => {
  return (
    <div className="mb-6">
    <h2 className="text-xl font-medium text-gray-900 mb-1">
      <span className="mr-2">{number}.</span> 
      {title}
    </h2>
    {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
  </div>

  )
}

export default SectionHeader