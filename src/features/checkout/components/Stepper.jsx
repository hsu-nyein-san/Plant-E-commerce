
import React from 'react'

const Stepper = ({ currentStep }) => {
  const steps = ['Shipping', 'Payment', 'Review', 'Confirmation']

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6">
        <h1 className="text-lg text-ink-muted">
          Checkout
        </h1>

        <a
          href="#"
          className="text-xs text-gray-500 underline underline-offset-4 hover:text-black transition-colors"
        >
          Need help? Contact support
        </a>
      </div>

      <div className="w-full mb-8 sm:mb-10 md:mb-12">
        <div className="flex items-center justify-between w-full">
          {steps.map((step, idx) => {
            const stepNumber = idx + 1
            const isActive = currentStep === stepNumber
            const isCompleted = currentStep > stepNumber

            return (
              <React.Fragment key={step}>
                <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 flex-shrink-0">

                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors
                      ${
                        isActive || isCompleted
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                  >
                    {isCompleted ? '✓' : stepNumber}
                  </div>

                  <span
                    className={`text-[10px] sm:text-xs md:text-sm whitespace-nowrap transition-colors
                      ${
                        isActive
                          ? 'text-black font-semibold'
                          : isCompleted
                          ? 'text-gray-700'
                          : 'text-gray-400'
                      }`}
                  >
                    {step}
                  </span>
                </div>

                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-px mx-1.5 sm:mx-3 md:mx-4 min-w-2
                      ${
                        currentStep > stepNumber
                          ? 'bg-black'
                          : 'bg-gray-200'
                      }`}
                  />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Stepper
