import React from 'react'

const Badge = ({ children, color = "gray" }) => {
    const colors = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-green-100 text-green-800",
    blue: "bg-blue-100 text-blue-800",
    orange: "bg-orange-100 text-orange-800"
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[color]}`}>
      {children}
    </span>

  )
}

export default Badge