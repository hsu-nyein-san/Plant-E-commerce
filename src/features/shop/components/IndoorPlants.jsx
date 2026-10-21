import { ChevronDown, Eye, Heart, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import useCookie from 'react-use-cookie'

const IndoorPlants = ({ result, pagination, onPageChange, setResult, setPagination }) => {
  const [productData, setProductData] = useState([])
  const [loading, setLoading] = useState(true)
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const LIMIT = 6;

  const [token] = useCookie("token")

  // console.log(pagination?.page);


  useEffect(() => {
    const mapPlant = (p) => ({
      id: p.id,
      name: p.name || 'Unnamed Plant',
      subtitle: p.subtitle || '',
      price: typeof p.price === 'number' ? p.price : 0,
      image: p.image_url || 'https://via.placeholder.com/400x500?text=No+Image',
      tags: [p.is_pet_safe && 'Pet-friendly', p.size, p.care_level].filter(Boolean),
      shipping: 'Ships in 2-4 business days',
      badge: p.maintenance === 'Low Maintenance' ? 'Easy Care' : p.maintenance === 'Moderate' ? 'Moderate Care' : "Advanced Care",
    })

    if (result !== null && result !== undefined && pagination?.pages === page) {
      setProductData(result.map(mapPlant))
      setLoading(false)
      setError(null)
      return
    }

    const fetchPlants = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`http://127.0.0.1:8000/api/plants/?page=${page}&limit=${LIMIT}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const data = await res.json()
        setProductData(data.items.map(mapPlant))
        setPagination({
          total: data.total,
          page: data.page,
          limit: data.limit,
          pages: data.pages,
          has_next: data.has_next,
          has_prev: data.has_prev,
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

  useEffect(()=>{
    const fetchWishlist=async()=>{
      const res=await fetch("http://127.0.0.1:8000/api/wishlist",{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })

      const data=await res.json();


      setWishlist(data);

      
      
    }
    fetchWishlist();
  },[])


  if (loading) {
    return (
      <div className="flex-1 min-w-0 flex items-center justify-center py-20">
        <p className="text-gray-500 text-sm">Loading plants… 🌿</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 min-w-0 flex items-center justify-center py-20">
        <p className="text-red-500 text-sm">
          Failed to load plants: {error}. Is the API running on port 8000?
        </p>
      </div>
    )
  }



  const goToPage = (newPage) => {
    const target = Number(newPage)

    console.log('🖱️ goToPage:', { from: page, to: target })

    if (!Number.isInteger(target)) return
    if (target < 1) return
    if (target === page) return                  // same page → skip
    if (pagination && target > pagination.pages) return

    setPage(target)
    onPageChange?.(target)
  }
  console.log(pagination?.pages);

  const toggleWishlist = async (plantId) => {

    const isWishlisted = wishlist.some((item)=>
    Number(item.plant_id) === Number(plantId)
)
    const res = await fetch(isWishlisted ? `http://127.0.0.1:8000/api/wishlist/${plantId}` : "http://127.0.0.1:8000/api/wishlist/",
      {
        method: isWishlisted ? 'DELETE' : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        ...(
          isWishlisted ? {}
            :
            {
              body: JSON.stringify(
                {
                  plant_id: plantId
                }
              )
            }
        )
      })
    const data = await res.json();

    const wishlistRes = await fetch(
      "http://127.0.0.1:8000/api/wishlist/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const wishlistData = await wishlistRes.json();


    setWishlist(wishlistData);



    if (res.ok) {
      toast.success(data.message)
    } else if (!res.ok) {
      toast.error(
        typeof data.detail === "string"
          ? data.detail
          : JSON.stringify(data.detail)
      );

    }
  }

  return (
    <div className="flex-1 min-w-0">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Indoor Plants</h1>
          <p className="text-sm text-gray-500">
            Showing curated plant recommendations for your space.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm mt-1 shrink-0">
          <span className="text-gray-500 hidden sm:inline-block">
            Showing <span className="font-semibold text-black">{productData.length}</span> items
          </span>
          <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-1.5 cursor-pointer hover:bg-gray-50 transition-colors">
            <span className="text-gray-500">Sort</span>
            <span className="font-medium">Recommended</span>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 mb-12">
        {productData.map((product) => (
          <div key={product.id} className="group flex flex-col relative p-3 border rounded-xl">
            <div className="relative bg-[#f8f8f8] rounded-xl overflow-hidden mb-4 aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-gray-900/90 backdrop-blur-sm text-white text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded">
                  {product.badge}
                </span>
              )}
              <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={() => toggleWishlist(product.id)} className="bg-white p-1.5 rounded-full shadow-sm hover:bg-gray-100 text-gray-700 transition-colors">
                  <Heart
                    size={14}
                    fill={wishlist.some((item)=> item.plant_id === product.id) ? "#e11d48" : "none"}
                    color={wishlist.some((item)=> item.plant_id=== product.id) ? "#e11d48" : "currentColor"}
                  />

                </button>
                <button className="bg-white p-1.5 rounded-full shadow-sm hover:bg-gray-100 text-gray-700 transition-colors">
                  <Eye size={14} />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0 bg-gradient-to-t from-black/20 to-transparent">
                <span className="text-[10px] font-medium text-gray-800 bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm">
                  {product.shipping}
                </span>
                <Link to={`/house-plants/${product.id}`}>
                  <button className="bg-black text-white text-xs font-medium px-3 py-1.5 rounded shadow hover:bg-gray-800 transition-colors">
                    Quick View
                  </button>
                </Link>
              </div>
            </div>

            <div className="flex justify-between items-start mb-1 gap-4">
              <h3 className="font-medium text-gray-900 leading-tight">{product.name}</h3>
              <span className="font-medium text-gray-900">${product.price.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-500 mb-3">{product.subtitle}</p>

            <div className="flex flex-wrap gap-1.5 mt-auto">
              {product.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-200 pt-6 pb-12 gap-6">
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <span className="flex items-center gap-4">
            <span className="text-gray-500">Display:</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="display" className="w-4 h-4 text-black focus:ring-black border-gray-300" />
              <span>Pagination</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="display" defaultChecked className="w-4 h-4 text-black focus:ring-black border-gray-300" />
              <span>Infinite Scroll</span>
            </label>
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-500">  Page {Math.min(page, pagination?.pages ?? 1)} of {pagination?.pages ?? 1}</span>
          <div className="flex gap-2">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page < 1}
              className={`px-4 py-2 border 
            ${page > 1 ? 'border-gray-300 bg-green-400 hover:bg-gray-50 text-black'
                  : 'border-gray-200 text-gray-400 cursor-not-allowed'
                } rounded-md text-gray-400 font-medium text-xs`}>
              Prev
            </button>
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= (pagination?.pages ?? 1)}
              className={`px-4 py-2rounded-md 
            ${page < (pagination?.pages ?? 1) ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-300 text-white cursor-not-allowed'
                }
             transition-colors font-medium text-xs`}>
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#f9f9f9] border border-gray-100 p-5 rounded-lg text-sm text-gray-600 leading-relaxed">
        <span className="font-semibold text-gray-900">Shipping & Returns.</span> Most plants ship in 1-5 business days depending on size. Live plants are guaranteed on arrival — if there is any issue, contact our support within 48 hours for a replacement or refund.
      </div>
    </div>
  )
}

export default IndoorPlants