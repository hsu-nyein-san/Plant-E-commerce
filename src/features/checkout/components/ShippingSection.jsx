import React from 'react'
import SectionHeader from './SectionHeader'
import CheckoutField from './CheckoutField'
import { ChevronDown } from 'lucide-react'
import RadioOption from './RadioOption'
import { useForm } from 'react-hook-form'

const ShippingSection = ({initialData={},onNext}) => {
  const {register,
    handleSubmit,
    formState:{errors},
}=useForm({
  defaultValues: {
      fullName: initialData.fullName || '',
      email: initialData.email || '',
      phone: initialData.phone || '',
      address: initialData.address || '',
      apt: initialData.apt || '',
      city: initialData.city || '',
      state: initialData.state || 'Oregon',
      zip: initialData.zip || '',
      delivery: 'Leave at door',
      dateTime: 'Morning',
      saveAddress: false,
    },
    mode: 'onBlur',   
})

const onSubmit=(data)=>{
  onNext?.(data)
}
    return (
        <form className="" onSubmit={handleSubmit(onSubmit)}>
            <SectionHeader
                number="1"
                title="Shipping"
                subtitle="Enter recipient details and choose delivery date & time."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <CheckoutField label="Full name" placeholder="Aye Aye" 
                error={
                  errors.fullName?.message
                }
                {
                  ...register('fullName',{
                    required:'Full name is required',
                    minLength:{value : 2,message :'At least 2 characters'}
                  })
                }
                />
                <CheckoutField label="Email" placeholder="ayeaye@gmail.com" 
                error={
                  errors.email?.message
                }
                {
                  ...register('email',{
                    required:'Email is required',
                    pattern:{
                      value: /^\S+@\S+\.\S+$/,
                      message: 'Invalid email',
                    }
                  })
                }
                />
                <CheckoutField label="Phone" placeholder="+1 (555) 000-0000" 
                error={
                  errors.phone?.message
                }
                {
                  ...register('phone',{
                    required:'Phone is required',
                    maxLength:{
                      value :11,
                      message:'Invalid phone'
                    }
                  })
                }
                />
                <CheckoutField label="Street address" placeholder="1234 Evergreen Ave" 
                error={errors.address?.message}
                {
                  ...register('address',{
                    required:'Address is required',
                  })
                }
                />

                <CheckoutField {...register('apt')} label="Apt, suite, etc." placeholder="Apt 4B" optional 
               />
                <CheckoutField label="City" placeholder="Portland" 
                error={errors.city?.message}
                {
                  ...register('city',{
                    required:'City is required'
                  })
                }
                />
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-gray-600 font-medium">State</label>
                    <div className="relative">
                        <select
                        {
                          ...register('state',{
                            required:'State is required'
                          })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2.5 text-sm appearance-none focus:outline-none focus:border-black">
                            <option>Oregon</option>
                            <option>California</option>
                            <option>Washington</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.state && (
            <p className="text-red-500 text-xs">{errors.state.message}</p>
          )}

                </div>
                <CheckoutField label="ZIP" placeholder="97205" 
                error={errors.zip?.message}
                {
                  ...register('zip',{
                    required: 'ZIP is required',
            pattern: { value: /^\d{4,10}$/, message: 'Invalid ZIP' },
                  })
                }
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Delivery preferences</h3>
                  <div className="space-y-3">
                    <RadioOption {...register('delivery')} value="Leave at door" label="Leave at door" name="delivery" defaultChecked />
                    <RadioOption {...register('delivery')} value="Signature required" label="Signature required" name="delivery" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Choose delivery date & time</h3>
                  <div className="flex gap-6 items-center">
                    <div className="w-24 h-24 relative flex items-center justify-center">
                       <div className="absolute top-2 left-2 w-10 h-10 bg-gray-800 rounded-full opacity-90"></div>
                       <div className="absolute bottom-4 left-0 w-6 h-6 bg-gray-800 rounded-full opacity-80"></div>
                       <div className="absolute top-6 right-2 w-8 h-8 bg-gray-800 rounded-full opacity-70"></div>
                       <div className="absolute bottom-0 right-0 w-12 h-12 bg-gray-800 rounded-full opacity-90"></div>
                    </div>
                    <div className="flex-1 space-y-3">
                      {
                        [
              { label: 'Morning — 9:00 AM – 12:00 PM', value: 'Morning', popular: true },
              { label: 'Afternoon — 12:00 PM – 4:00 PM', value: 'Afternoon' },
              { label: 'Evening — 4:00 PM – 8:00 PM', value: 'Evening' },
            ].map((slot)=>(
              <label
                key={slot.value}
                className="block p-3 border border-gray-200 rounded-md cursor-pointer hover:border-black transition-colors has-[:checked]:border-black has-[:checked]:bg-gray-50"
              >
                <input
                  type="radio"
                  value={slot.value}
                  {...register('dateTime')}
                  className="hidden"
                />
                <p className="text-xs font-medium">{slot.label}</p>
                {slot.popular && (
                  <p className="text-[10px] text-gray-500 mt-1">Most popular</p>
                )}
              </label>

            ))
                      }
                      {/* <div className="p-3 border border-gray-200 rounded-md cursor-pointer hover:border-black transition-colors">
                        <p className="text-xs font-medium">Morning — 9:00 AM – 12:00 PM</p>
                        <p className="text-[10px] text-gray-500 mt-1">Most popular</p>
                      </div>
                      <div className="p-3 border border-gray-200 rounded-md cursor-pointer hover:border-black transition-colors opacity-60">
                        <p className="text-xs font-medium">Afternoon — 12:00 PM – 4:00 PM</p>
                      </div>
                      <div className="p-3 border border-gray-200 rounded-md cursor-pointer hover:border-black transition-colors opacity-60">
                        <p className="text-xs font-medium">Evening — 4:00 PM – 8:00 PM</p>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
                 <div className="flex items-center gap-2">
                    <input type="checkbox" {...register('saveAddress')} id="save" className="accent-black" />
                    <label htmlFor="save" className="text-sm text-gray-600">Save this address for future orders</label>
                 </div>
                 <div className="flex gap-4">
                    <button className="px-6 py-3 text-sm font-medium text-gray-600 hover:text-black transition-colors">
                      Save & continue later
                    </button>
                    <button  type='submit' className="px-6 py-3 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors">
                      Continue to payment
                    </button>
                 </div>
              </div>



        </form>
    )
}

export default ShippingSection