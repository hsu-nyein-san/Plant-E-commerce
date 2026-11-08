
import React, { useState } from 'react'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'

const SideFilters = ({
  setResult,
  setPagination,
  page = 1,
  limit = 6
}) => {
  const [price, setPrice] = useState(50)
  const [roomLight, setRoomLight] = useState(null)
  const [size, setSize] = useState([])
  const [pet, setPet] = useState(null)
  const [careLevel, setCareLevel] = useState([])
  const [category, setCategory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  const roomLightOptions = [
    'Low', 'Medium', 'Bright indirect', 'Full Sun'
  ]

  const sizeOptions = [
    'Small (Under 12")',
    'Medium (12"-36")',
    'Large (36"+)'
  ]

  const petOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false }
  ]

  const careLevelOptions = [
    'Easy', 'Moderate', 'Advanced'
  ]

  const categoryOptions = [
    'Tropical', 'Succulents', 'Air Purifying'
  ]

  const handleResults = async (targetPage = 1) => {
    try {
      setLoading(true)
      setError(null)

      const payload = {
        room_light: roomLight,
        size,
        pet_friendly: pet,
        care_level: careLevel,
        price,
        category
      }

      const res = await fetch(
        `http://127.0.0.1:8000/api/plant/?page=${targetPage}&limit=${limit}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      )

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const matched = await res.json()

      setResult?.(matched.items)

      setPagination?.({
        total: matched.total,
        page: matched.page,
        limit: matched.limit,
        pages: matched.pages,
        has_next: matched.has_next,
        has_prev: matched.has_prev
      })

      setIsOpen(false)

    } catch (error) {
      console.error('Plant filter failed:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setRoomLight(null)
    setSize([])
    setPet(null)
    setCareLevel([])
    setPrice(50)
    setCategory([])
    setError(null)
  }

  return (
    <div className="border border-border rounded-lg bg-white">

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-full flex justify-between items-center p-4"
      >
        <span className="flex items-center gap-2 font-semibold text-gray-900">
          <SlidersHorizontal size={18} />
          Filters
        </span>

        <ChevronDown
          size={18}
          className={`transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <aside className={`${isOpen ? 'block' : 'hidden'} lg:block p-4`}>

        <div className="flex justify-between items-center mb-5">
          <h2 className="font-semibold text-gray-900 hidden lg:block">
            Filters
          </h2>

          <button
            onClick={handleReset}
            className="text-xs text-gray-500 hover:text-black transition-colors"
          >
            Reset
          </button>
        </div>

        <div className="text-sm">

          <div className="mb-5">
            <h3 className="font-medium text-gray-900 mb-3">
              Light requirement
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {roomLightOptions.map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="light"
                    checked={roomLight === option}
                    onChange={() => setRoomLight(option)}
                    className="w-4 h-4 accent-black"
                  />
                  <span className="text-gray-600 text-xs sm:text-sm">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <h3 className="font-medium text-gray-900 mb-3">Size</h3>

            <div className="space-y-3">
              {sizeOptions.map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={size.includes(option)}
                    onChange={(e) => {
                      setSize(prev =>
                        e.target.checked
                          ? [...prev, option]
                          : prev.filter(item => item !== option)
                      )
                    }}
                    className="w-4 h-4 accent-black"
                  />
                  <span className="text-gray-600 text-xs sm:text-sm">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <h3 className="font-medium text-gray-900 mb-3">
              Pet-friendly
            </h3>

            <div className="flex gap-6">
              {petOptions.map((option) => (
                <label key={String(option.value)} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="pet_friendly"
                    checked={pet === option.value}
                    onChange={() => setPet(option.value)}
                    className="w-4 h-4 accent-black"
                  />
                  <span className="text-gray-600">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <h3 className="font-medium text-gray-900 mb-3">
              Care level
            </h3>

            <div className="space-y-3">
              {careLevelOptions.map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={careLevel.includes(option)}
                    onChange={(e) => {
                      setCareLevel(prev =>
                        e.target.checked
                          ? [...prev, option]
                          : prev.filter(item => item !== option)
                      )
                    }}
                    className="w-4 h-4 accent-black"
                  />
                  <span className="text-gray-600">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <h3 className="font-medium text-gray-900 mb-3">
              Price range
            </h3>

            <input
              type="range"
              min="0"
              max="100"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />

            <div className="flex justify-between mt-3">
              <span className="border rounded-md px-3 py-1 text-xs text-gray-600">
                ${price}
              </span>
              <span className="border rounded-md px-3 py-1 text-xs text-gray-600">
                $100+
              </span>
            </div>
          </div>

          <div className="mb-5">
            <h3 className="font-medium text-gray-900 mb-3">
              Categories
            </h3>

            <div className="space-y-3">
              {categoryOptions.map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={category.includes(option)}
                    onChange={(e) => {
                      setCategory(prev =>
                        e.target.checked
                          ? [...prev, option]
                          : prev.filter(item => item !== option)
                      )
                    }}
                    className="w-4 h-4 accent-black"
                  />
                  <span className="text-gray-600">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-4 pb-5 border-b border-gray-100">
            Tip: Select your preferences and apply filters to find
            the perfect plants for your space.
          </p>

          {error && (
            <p className="text-xs text-red-500 mb-3">{error}</p>
          )}

          <button
            onClick={() => handleResults(page)}
            disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Applying...' : 'Show filters'}
          </button>

        </div>
      </aside>
    </div>
  )
}

export default SideFilters
