import { Leaf } from 'lucide-react'
import React from 'react'

const ItemsOrder = ({items}) => {

    
    return (
        <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#E8F1E8]">
                <img src={items.image_url} alt={items.plant_name} className='rounded-lg'/>
            </div>

            <div className="min-w-0 flex-1">
                <h3 className="font-medium text-gray-800">
                    {items.plant_name}
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                    {items.category}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                    ${items.price} × {items.quantity}
                </p>
            </div>

            <p className="font-semibold text-gray-800">${items.price * items.quantity}</p>
        </div>
    )
}

export default ItemsOrder