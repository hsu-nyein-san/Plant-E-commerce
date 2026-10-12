import { Heart, ShoppingCart } from 'lucide-react'
import React from 'react'
import Badge from './Badge'

const ProductCard = ({ name, subtitle, price, image, tags, isBestFor }) => {
    return (
        <div className="flex flex-col gap-4 p-4 border border-gray-200 rounded-xl bg-white hover:shadow-md transition-shadow">
            <div className="w-full h-32 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
                <img src={image} alt={name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col justify-between flex-1">
                <div>
                    <h4 className="font-bold text-gray-900">{name}</h4>
                    <p className="text-xs text-gray-500 italic mb-2">{subtitle}</p>

                    {isBestFor && (
                        <div className="mb-3">
                            <Badge color="green">{isBestFor}</Badge>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map((tag, i) => (
                            <Badge key={i} color={tag.color || "gray"}>{tag.label}</Badge>
                        ))}
                    </div>
                </div>

                <div className="flex items-end justify-between">
                    <span className="text-lg font-bold text-gray-900">${price}</span>
                    <div className="flex gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                            <Heart className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-[#4A6A48] transition-colors">
                            <ShoppingCart className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ProductCard