import React from 'react'
import ProductCard from './ProductCard'
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

const CuratedMatches = ({ results , setSelected ,selected }) => {

  return (
    <div className="mt-8 sm:mt-12 min-w-0">

      <div className="mb-5 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          Curated Matches
        </h2>

        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Plants selected based on your preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">

        {results?.map((plant, idx) => (
          <ProductCard
            name={plant.name}
            key={plant.id || idx}
            subtitle={plant.subtitle}
            price={plant.price}
            plant_id={plant.id}
            image={plant.image_url}
            isBestFor={plant.light_requirement}
            category={plant.category}
            setSelected={setSelected}
            light_requirement={plant.light_requirement}
            maintenance={plant.maintenance}
            water_frequency={plant.water_frequency}
            selected={selected}
            tags={[
              {
                label: plant.is_pet_safe ? 'Pet Safe' : 'Not Pet Safe',
                color: 'green'
              },
              {
                label: plant.maintenance,
                color: 'blue'
              }
            ]}
          />
        ))}

      </div>

      {(!results || results.length === 0) && (
        <div className="text-center py-10 px-4 border border-dashed border-gray-200 rounded-xl">
          <p className="text-sm text-gray-500">
            No plant recommendations yet. Select your preferences and get results.
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">

        <Link to="/wishlist">
          <button className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-3 border border-gray-300 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Heart className="w-4 h-4" />
            View Wishlist
          </button></Link>

        <Link to="/my-orders">
          <button className="w-full sm:w-auto px-6 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
            View All Plants
          </button>
        </Link>

      </div>

    </div>
  )
}

export default CuratedMatches
