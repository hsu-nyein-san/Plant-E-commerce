import { ChevronRight, Heart, Truck } from 'lucide-react';
import React, { createContext, useEffect, useMemo, useState } from 'react';
import BreadCrumb from '../../../components/BreadCrumb';
import { data } from 'autoprefixer';
import useCookie from 'react-use-cookie';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'leafly_cart'
const PlantInfo = ({ productId }) => {

    const [plantInfo, setPlantInfo] = useState([]);
    const [loading, setLoading] = useState(false);
    const [wishlist, setWishlist] = useState([]);
    const [exitingItem, setExitingItem] = useState(false);
    const CartContext = createContext()
    const [token] = useCookie("token");
    const navigate = useNavigate();


    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY)
            return saved ? JSON.parse(saved) : []
        } catch (err) {
            console.error('Failed to load cart:', err)
            return []
        }
    })

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
        } catch (err) {
            console.error('Failed to save cart:', err)
        }
    }, [cart])


    useEffect(() => {
        const fetchPlantDetail = async () => {

            try {
                setLoading(true);
                const res = await fetch(`http://127.0.0.1:8000/api/plants/${productId}`);
                if (!res.ok) throw new Error(`Http ${res.status}`);
                const data = await res.json();

                setPlantInfo(data);
            } catch (error) {
                console.error(error);
                setError(err.message);

            } finally {
                setLoading(false);
            }
        }
        fetchPlantDetail();
    }, []);

    useEffect(() => {
        const fetchWishlist = async () => {
            const res = await fetch("http://127.0.0.1:8000/api/wishlist", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await res.json();
            setWishlist(data)
        }
        if (token) {
            fetchWishlist();
        }
    }, [])




    const isExitsing = useMemo(
        () => cart.some((item) => item.id === productId),
        [cart, productId]
    )


    const handleCart = (plant) => {

        const isInCart = cart.some((item) => item.id === plant.id)

        if (isInCart) {
            setCart((prev) => prev.filter((item) => item.id !== plant.id))
        }
        else {
            setCart((prev) => [
                ...prev,
                {
                    id: plant.id,
                    name: plant.name,
                    price: plant.price,
                    image: plant.image_url || plant.image,
                    category:plant.category,
                    quantity: 1
                }
            ])
        }


        setExitingItem(isInCart)

    }

    const isWishList = wishlist.some((item) => item.plant_id === productId)


    const toggleWishlist = async (productId) => {

        if (token) {
            const res = await fetch(isWishList ? `http://127.0.0.1:8000/api/wishlist/${productId}` : "http://127.0.0.1:8000/api/wishlist",
                {
                    method: isWishList ? 'DELETE' : 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json"
                    },
                    ...(
                        isWishList ? {}
                            :
                            {
                                body: JSON.stringify({
                                    plant_id: productId
                                })
                            }
                    )
                }
            )
            const data = await res.json();

            const get_res = await fetch("http://127.0.0.1:8000/api/wishlist", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const wishlistData = await get_res.json();
            setWishlist(wishlistData)

            if (res.ok) {
                toast.success(data.message)
            }
            else if (!res.ok) {
                toast.error(data.message)
            }
        }
        else {
            navigate("/login")
        }
    }


    return (
        <div className="flex flex-col gap-6">
            <div>
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">

                    <BreadCrumb
                        currentPageTitle={"Houseplants"}
                        links={[{ title: "shop", path: "/shop" }]}
                    />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">{plantInfo.name}</h1>
                <p className="text-gray-500 text-sm mt-1">Botanical name: {plantInfo.subtitle}</p>

                <div className="flex justify-between items-start mt-4">
                    <div className="text-2xl font-medium">${plantInfo.price}.00</div>
                    <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        in stock
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <button onClick={() => handleCart(plantInfo)} className="w-full bg-black text-sm text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                    {
                        isExitsing ? 'Added' : 'Add'
                    } to Cart
                </button>
                <div className="flex gap-3">
                    <button className="flex-1 border text-sm border-gray-300 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                        <Truck className="w-4 h-4" />
                        Schedule Delivery
                    </button>
                    <button onClick={() => toggleWishlist(productId)} className="flex-1 border text-sm border-gray-300 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                        <Heart className="w-7 h-7"
                            fill={isWishList ? "#e11d48" : "none"}
                            color={isWishList ? "#e11d48" : "currentColor"}
                        />
                        {
                            isWishList ? 'Added' : 'Add'
                        } to Wishlist
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded text-xs font-medium">Light: {plantInfo.light_requirement}</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-medium">Size: {plantInfo.size}</span>
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-xs font-medium">Pet-friendly: {plantInfo.is_pet_safe ? 'Yes' : 'No'}</span>
                <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded text-xs font-medium">Care Level: {plantInfo.care_level}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 py-4 text-sm">
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">SKU</p>
                    <p className="font-medium mt-1">{plantInfo.sku}</p>
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Dimensions</p>
                    <p className="font-medium mt-1">{plantInfo.dimensions}</p>
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Origin</p>
                    <p className="font-medium mt-1">{plantInfo.origin}</p>
                </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
                <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="leading-relaxed">
                        {plantInfo.description}
                    </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Care Instructions</h3>
                    <ul className="list-disc pl-5 space-y-1 leading-relaxed">
                        {plantInfo.care_instructions?.split('\n').map((instruction, index) => {
                            const [label, ...rest] = instruction.split(':');
                            return (
                                <li key={index}><strong>{label}:</strong> {rest.join(':')}</li>
                            )
                        })
                        }
                    </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Delivery & Returns</h3>
                    <p className="leading-relaxed">
                        Standard delivery: 3–7 business days. Plants are shipped in eco-friendly packaging with breathable wraps. If your plant arrives damaged, contact support within 48 hours for replacement or refund. Live plant returns accepted within 7 days under our care guarantee.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PlantInfo;