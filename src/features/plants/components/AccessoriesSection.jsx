import { Star } from 'lucide-react'
import React from 'react'

const AccessoriesSection = () => {
    const accessories = [
  {
    id: 1,
    name: "Terra Cotta Pot",
    subtitle: "6in",
    price: 18.00,
    image: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: 2,
    name: "Organic Potting Mix",
    subtitle: "5L",
    price: 12.50,
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: 3,
    name: "Balanced Fertilizer",
    subtitle: "250ml",
    price: 9.00,
    image: "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&q=80&w=200"
  }
];

  return (
    <div className="mt-12">
      <div className="flex justify-between items-end mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recommended Acccessories</h3>
        <span className="text-xs text-gray-400">3 items</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {accessories.map((item) => (
          <div key={item.id} className="border border-gray-100 rounded-lg p-3 flex gap-3 hover:shadow-sm transition-shadow cursor-pointer">
            <div className="w-16 h-16 bg-gray-50 rounded flex-shrink-0">
               <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-sm font-medium text-gray-900 leading-tight">{item.name}</p>
              <p className="text-xs text-gray-500">{item.subtitle}</p>
              <p className="text-sm font-semibold mt-1">${item.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>


  )
}

export default AccessoriesSection