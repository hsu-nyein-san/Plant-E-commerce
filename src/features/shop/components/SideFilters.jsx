import React, { useState } from 'react'

const SideFilters = ({setResult,setPagination, page = 1, limit = 6}) => {
  const [price, setPrice] = useState(50)
  const [roomLight,setRoomLight]=useState(null);
  const [size,setSize]=useState([]);
  const [pet,setPet]=useState(null);
  const [careLevel,setCareLevel]=useState([]);
  const [category,setCategory]=useState([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);

  const roomLightOptions=[
    'Low','Medium','Bright indirect','Full Sun'
  ]
  const sizeOptions=[
    'Small (Under 12")','Medium (12"-36")','Large (36"+)'
  ]

  const petOptions = [
    {
      label: 'Yes', value: true
    },
    {
      label: 'No', value: false
    }
  ]

  const careLevelOptions=[
    'Easy','Moderate','Advanced'
  ]

  const categoryOptions=[
    'Tropical','Succulents','Air Purifying'
  ]

  const handleResults=async(targetPage =1)=>{
    try {
      setLoading(true);
      const payload={
        room_light:roomLight,
        size:size,
        pet_friendly:pet,
        care_level:careLevel,
        price:price,
        category:category
      }
      const res=await fetch(`http://127.0.0.1:8000/api/plant/?page=${page}&limit=${limit}`,{
        method: 'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(payload)
      })
      
      if (!res.ok) throw new Error(`Http ${res.status}`)
      

        console.log('📥 Status:', payload)

      const matched=await res.json();

      // console.log(matched);
      
      

      if(setResult) setResult(matched.items)


        if (setPagination) setPagination({
          total:matched.total,
          page:matched.page,
          limit:matched.limit,
          pages:matched.pages,
          has_next:matched.has_next,
          has_prev:matched.has_prev,
        })
      
    } catch (error) {
      console.error('Plant filter failed:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset=()=>{
    setRoomLight(null);
    setSize([]);
    setPet(null);
    setCareLevel([]);
    setPrice(50);
    setCategory([]);
  }

  return (
    <div className="border rounded-lg border-border">
      <aside className=" flex-shrink-0 p-4">


        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-900">Filters</h2>

          <div className="text-xs text-gray-500 space-x-3">
            <button onClick={()=>handleReset()} className="hover:text-black transition-colors">
              Reset
            </button>

            <button className="hover:text-black transition-colors">
              Collapse
            </button>
          </div>
        </div>

        <div className="text-sm">

          
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-3 text-sm">
              Light requirement
            </h3>

            <div className="space-y-2 grid grid-cols-2">
              {
                roomLightOptions.map((room_light,idx)=>(
                  <label key={idx} className="flex items-center gap-2 cursor-pointer">
                <input checked={room_light === roomLight}  onClick={()=>setRoomLight(room_light)}
                  type="radio"
                  name='light'
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                />
                <span className="text-sm text-gray-600">
                  {room_light}
                </span>
              </label>
                ))
              }

              
            </div>
          </div>

          {/* Size */}
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-3 text-sm">
              Size
            </h3>

            <div className="space-y-2">
              {
                sizeOptions.map((sizeOption,idx)=>(
                  <label key={idx} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={size.includes(sizeOption)}
                  onChange={(e)=>{
                    if (e.target.checked)
                    {
                      setSize([...size,sizeOption])
                    }
                    else
                    {
                      setSize(size.filter((item)=>item != sizeOption))
                    }
                  }}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                />
                <span className="text-sm text-gray-600">
                  {sizeOption}
                </span>
              </label>
                ))
              }

              
            </div>
          </div>

          {/* Pet Friendly */}
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-3 text-sm">
              Pet-friendly
            </h3>

            <div className="space-y-2">
              {
                petOptions.map((pet_option,idx)=>(
                  <label className="flex items-center gap-2 cursor-pointer">
                <input
                  checked={pet === pet_option.value}
                  name='pet_friendly'         
                  type="radio" key={idx}
                  onChange={()=>setPet(pet_option.value)}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                />
                <span className="text-sm text-gray-600">
                  {pet_option.label}
                </span>
              </label>
                ))
              }

              
            </div>
          </div>

          {/* Care Level */}
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-3 text-sm">
              Care level
            </h3>

            <div className="space-y-2">
              {
                careLevelOptions.map((opt)=>(
                  <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={careLevel.includes(opt)}
                  onChange={(e)=>{
                    if(e.target.checked)
                    {
                      setCareLevel([...careLevel,opt])
                    }
                    else{
                      setCareLevel(careLevel.filter((item)=> item != opt))
                    }
                  }}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                />
                <span className="text-sm text-gray-600">
                  {opt}
                </span>
              </label>
                ))
              }

              

             
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-3 text-sm">
              Price range
            </h3>

            <input
              type="range"
              min="0"
              max="100"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
            />

            <div className="flex justify-between items-center mt-3">
              <div className="border border-gray-200 rounded-md px-3 py-1 text-gray-600 text-xs w-20 text-center">
                ${price}
              </div>

              <div className="border border-gray-200 rounded-md px-3 py-1 text-gray-600 text-xs w-20 text-center">
                $100+
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-3 text-sm">
              Categories
            </h3>

            <div className="space-y-2">

              {
                categoryOptions.map((opt)=>(
                  <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={category.includes(opt)}
                    onChange={(e)=>{
                      if(e.target.checked)
                      {
                        setCategory([...category,opt])
                      }
                      else{
                        setCategory(category.filter((item)=> item != opt))
                      }
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">
                    {opt}
                  </span>
                </div>

                <span className="text-gray-400 text-xs">
                  28
                </span>
              </label>
                ))
              }

            

            </div>
          </div>

          {/* Tip */}
          <p className="text-xs text-gray-400 mb-4 pb-6 border-b border-gray-100">
            Tip: Use the keyboard to navigate filters and press Enter to apply.
          </p>

          {/* Button */}
          <button onClick={()=>handleResults()} className="w-full bg-black text-white py-2.5 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
            Show filters
          </button>

        </div>
      </aside>
    </div>
  )
}

export default SideFilters