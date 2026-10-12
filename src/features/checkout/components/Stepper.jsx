import React from 'react'

const Stepper = ({currentStep}) => {
    return (
        <div className="">
            <div className="flex flex-row justify-between pb-6">
                <h1 className='text-lg text-ink-muted'>Checkout</h1>
                <a href="#" className="text-xs text-gray-500 underline underline-offset-4 hover:text-black">Need help? Contact support</a>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div className="flex items-center gap-4 md:gap-8 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    {['Shipping', 'Payment', 'Review', 'Confirmation'].map((step, idx) => (
                        
                        <div key={step} className="flex items-center gap-2 whitespace-nowrap">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                  ${idx === (currentStep-1) ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                                {idx + 1}
                            </div>
                            <span className={`text-sm ${idx === 0 ? 'text-black font-medium' : 'text-gray-400'}`}>
                                {step}{idx}
                            </span>
                            {idx < 3 && <div className="w-8 h-[1px] bg-gray-200 hidden md:block ml-2"></div>}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default Stepper