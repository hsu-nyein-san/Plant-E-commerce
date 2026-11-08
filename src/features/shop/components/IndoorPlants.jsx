
import { ChevronDown, Eye, Heart } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import useCookie from 'react-use-cookie'

const IndoorPlants = ({
  result,
  pagination,
  onPageChange,
  setResult,
  setPagination
}) => {
  const [productData, setProductData] = useState([])
  const [loading, setLoading] = useState(true)
  const [wishlist, setWishlist] = useState([])
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)

  const LIMIT = 6
  const navigate = useNavigate()
  const [token] = useCookie('token')

  const mapPlant = (p) => ({
    id: p.id,
    name: p.name || 'Unnamed Plant',
    subtitle: p.subtitle || '',
    price: typeof p.price === 'number' ? p.price : 0,
    image: p.image_url || 'https://via.placeholder.com/400x500?text=No+Image',
    tags: [
      p.is_pet_safe && 'Pet-friendly',
      p.size,
      p.care_level
    ].filter(Boolean),
    shipping: 'Ships in 2-4 business days',
    badge:
      p.maintenance === 'Low Maintenance'
        ? 'Easy Care'
        : p.maintenance === 'Moderate'
          ? 'Moderate Care'
          : 'Advanced Care'
  })

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true)
        setError(null)

        // Use filtered results when available
        if (result !== null && result !== undefined) {
          setProductData(result.map(mapPlant))
          return
        }

        const res = await fetch(
          `http://127.0.0.1:8000/api/plants/?page=${page}&limit=${LIMIT}`
        )

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }

        const data = await res.json()

        setProductData(data.items.map(mapPlant))

        setPagination?.({
          total: data.total,
          page: data.page,
          limit: data.limit,
          pages: data.pages,
          has_next: data.has_next,
          has_prev: data.has_prev
        })

      } catch (err) {
        console.error('Failed to load plants:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPlants()
  }, [page, result])

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch(
          'http://127.0.0.1:8000/api/wishlist/',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }

        const data = await res.json()
        setWishlist(data)

      } catch (err) {
        console.error('Failed to load wishlist:', err)
      }
    }

    if (token) {
      fetchWishlist()
    }
  }, [token])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500 text-sm">
          Loading plants… 🌿
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-red-500 text-sm text-center">
          Failed to load plants: {error}. Is the API running on port 8000?
        </p>
      </div>
    )
  }

  const totalPages = pagination?.pages ?? 1

  const goToPage = (newPage) => {
    const target = Number(newPage)

    if (!Number.isInteger(target)) return
    if (target < 1 || target > totalPages) return
    if (target === page) return

    setPage(target)
    onPageChange?.(target)

    if (result !== null && result !== undefined) {
      setResult?.(null)
    }

  }

  const toggleWishlist = async (plantId) => {
    if (!token) {
      navigate('/login')
      return
    }

    try {
      const isWishlisted = wishlist.some(
        (item) => Number(item.plant_id) === Number(plantId)
      )

      const res = await fetch(
        isWishlisted
          ? `http://127.0.0.1:8000/api/wishlist/${plantId}`
          : 'http://127.0.0.1:8000/api/wishlist/',
        {
          method: isWishlisted ? 'DELETE' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          ...(isWishlisted
            ? {}
            : {
                body: JSON.stringify({
                  plant_id: plantId
                })
              })
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(
          typeof data.detail === 'string'
            ? data.detail
            : 'Failed to update wishlist'
        )
      }

      const wishlistRes = await fetch(
        'http://127.0.0.1:8000/api/wishlist/',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const wishlistData = await wishlistRes.json()
      setWishlist(wishlistData)

      toast.success(data.message)

    } catch (err) {
      console.error('Wishlist error:', err)
      toast.error(err.message)
    }
  }

  return (
    <div className="w-full min-w-0">

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4">

        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            Indoor Plants
          </h1>

          <p className="text-xs sm:text-sm text-gray-500">
            Showing curated plant recommendations for your space.
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 text-sm shrink-0">

          <span className="text-gray-500">
            Showing{' '}
            <span className="font-semibold text-black">
              {productData.length}
            </span>{' '}
            items
          </span>

          <button className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 transition-colors">
            <span className="text-gray-500">Sort</span>
            <span className="font-medium">Recommended</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

        </div>
      </div>

      {productData.length === 0 ? (
        <div className="text-center py-16 border border-gray-100 rounded-xl">
          <p className="text-gray-500 text-sm mb-2">
            No plants found.
          </p>
          <p className="text-gray-400 text-xs">
            Try adjusting your filters.
          </p>
        </div>
      ) : (

        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-12">

          {productData.map((product) => {

            const isWishlisted = wishlist.some(
              (item) =>
                Number(item.plant_id) === Number(product.id)
            )

            return (
              <div
                key={product.id}
                className="group flex flex-col relative min-w-0 p-2 sm:p-3 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow"
              >

                <div className="relative bg-[#f8f8f8] rounded-xl overflow-hidden mb-4 aspect-square">

                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {product.badge && (
                    <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-gray-900/90 text-white text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded">
                      {product.badge}
                    </span>
                  )}

                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">

                    <button
                      onClick={() => toggleWishlist(product.id)}
                      aria-label="Toggle wishlist"
                      className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-100 text-gray-700 transition-colors"
                    >
                      <Heart
                        size={15}
                        fill={isWishlisted ? '#e11d48' : 'none'}
                        color={isWishlisted ? '#e11d48' : 'currentColor'}
                      />
                    </button>

                    <Link
                      to={`/house-plants/${product.id}`}
                      aria-label={`View ${product.name}`}
                      className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-100 text-gray-700 transition-colors"
                    >
                      <Eye size={15} />
                    </Link>

                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-3 hidden sm:flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0 bg-gradient-to-t from-black/20 to-transparent">

                    <span className="text-[10px] font-medium text-gray-800 bg-white/90 px-2 py-1 rounded shadow-sm">
                      {product.shipping}
                    </span>

                    <Link to={`/house-plants/${product.id}`}>
                      <button className="bg-black text-white text-xs font-medium px-3 py-1.5 rounded shadow hover:bg-gray-800 transition-colors">
                        Quick View
                      </button>
                    </Link>

                  </div>

                </div>

                <div className="flex flex-col flex-1">

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2 mb-1">

                    <h3 className="font-medium text-gray-900 leading-tight text-sm sm:text-base break-words">
                      {product.name}
                    </h3>

                    <span className="font-semibold text-gray-900 text-sm sm:text-base whitespace-nowrap">
                      ${product.price.toFixed(2)}
                    </span>

                  </div>

                  <p className="text-xs text-gray-500 mb-3">
                    {product.subtitle}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-auto">

                    {product.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[9px] sm:text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium"
                      >
                        {tag}
                      </span>
                    ))}

                  </div>

                </div>

              </div>
            )
          })}

        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-t border-gray-200 pt-6 pb-10 gap-5">

        <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-600">

          <span className="text-gray-500">
            Display:
          </span>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name="display"
              defaultChecked
              className="w-4 h-4 accent-black"
            />
            <span>Pagination</span>
          </label>

        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto text-sm">

          <span className="text-gray-500 text-xs sm:text-sm whitespace-nowrap">
            Page {Math.min(page, totalPages)} of {totalPages}
          </span>

          <div className="flex gap-2">

            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className={`px-3 sm:px-4 py-2 border rounded-md text-xs font-medium transition-colors ${
                page > 1
                  ? 'border-gray-300 bg-white hover:bg-gray-50 text-black'
                  : 'border-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Prev
            </button>

            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
              className={`px-3 sm:px-4 py-2 rounded-md text-xs font-medium transition-colors ${
                page < totalPages
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-300 text-white cursor-not-allowed'
              }`}
            >
              Next
            </button>

          </div>
        </div>

      </div>

      <div className="bg-[#f9f9f9] border border-gray-100 p-4 sm:p-5 rounded-lg text-xs sm:text-sm text-gray-600 leading-relaxed">

        <span className="font-semibold text-gray-900">
          Shipping & Returns.
        </span>{' '}

        Most plants ship in 1-5 business days depending on size.
        Live plants are guaranteed on arrival — if there is any issue,
        contact our support within 48 hours for a replacement or refund.

      </div>

    </div>
  )
}

export default IndoorPlants
