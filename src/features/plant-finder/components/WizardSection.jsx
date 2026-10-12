import { Check } from 'lucide-react'
import React from 'react'

const WizardSection = ({ number, title, subtitle, isCompleted, children }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-100">
    <div className="flex items-start gap-3 mb-4">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isCompleted ? 'bg-brand text-white' : 'bg-gray-200 text-gray-600'}`}>
        {isCompleted ? <Check className="w-3 h-3" /> : number}
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>
    </div>
    <div className="pl-9">
      {children}
    </div>
  </div>

  )
}

export default WizardSection