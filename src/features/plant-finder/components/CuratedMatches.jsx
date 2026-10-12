import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { Heart } from 'lucide-react'

const CuratedMatches = ({results}) => {
  // console.log(results);
  
  // const [matchPlant,setMatchPLants]=useState([]);
  
  // useEffect(() => {
  //   setMatchPLants(results || []);
  // }, [results]);

 

  // console.log(matchPlant);
  

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Curated Matches</h2>
      <div className="grid sm:grid-cols-1 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {
          results?.map((plant,idx)=>(
<ProductCard
          name={plant.name} key={idx}
          subtitle={plant.subtitle}
          price={plant.price}
          image={plant.image_url}
          isBestFor={plant.light_requirement}
          tags={[
            { label:  plant.is_pet_safe ? "Pet Safe" : "Not Pet Safe", color: "green" },
            { label: plant.maintenance, color: "blue" }
          ]}
        />
          ))
        }

       

        {/* Placeholder for layout alignment if needed, or just let grid flow */}
      </div>
      <div className="flex justify-center gap-3 mt-8">
        <button className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          <Heart className="w-4 h-4" />
          View Wishlist
        </button>
        <button className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
          View All Plants
        </button>
      </div>
    </div>

  )
}

export default CuratedMatches