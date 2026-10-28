import { result } from 'lodash';
import React, { useEffect } from 'react'

const OrderItem = ({item}) => {

    

    return (
        <div className="flex items-center gap-3 sm:gap-4">
            <div className="h-[68px] w-[68px] shrink-0 overflow-hidden rounded-xl bg-[#F7F4EF]">
                <img
                    src={item.image_url}
                    alt="Monstera Deliciosa"
                    className="h-full w-full object-cover"
                />
            </div>
            <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium text-gray-900">
                    {item.plant_name}
                </h4>
                <p className="mt-1 text-xs text-gray-500">{item.category}</p>
                <p className="mt-1 text-xs text-gray-400">Qty: {item.quantity}</p>
            </div>
            <p className="shrink-0 text-sm font-medium text-gray-800">
                ${item.subtotal}
            </p>
        </div>

    )
}

export default OrderItem