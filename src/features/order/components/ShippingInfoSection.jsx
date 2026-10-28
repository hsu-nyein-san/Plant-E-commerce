import { MapPin } from 'lucide-react'
import React from 'react'

const ShippingInfoSection = ({detail}) => {
    
    return (
        <section className="rounded-2xl border border-[#EAE7DF] bg-[rgb(246,246,245)] p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-[#E8F1E8] p-2.5">
                    <MapPin size={20} className="text-[#2B7A4B]" />
                </div>
                <div>
                    <h2 className="font-semibold text-[#26372D]">
                        Shipping Information
                    </h2>
                    <p className="mt-1 text-xs text-gray-400">
                        Delivery address
                    </p>
                </div>
            </div>

            <div className="space-y-3 text-sm">
                <p className="font-medium text-gray-800">
                    {detail.shipping_name}
                </p>
                <p className="text-gray-500">{detail.shipping_address}</p>
                <p className="text-gray-500">
                    {detail.shipping_city}
                </p>
                <p className="text-gray-500">{detail.shipping_phone}</p>
            </div>
        </section>
    )
}

export default ShippingInfoSection