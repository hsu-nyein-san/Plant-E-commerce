import { Check, Heart, ShoppingCart } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Badge from './Badge'
import useCookie from 'react-use-cookie'

const ProductCard = ({ plant_id, name, subtitle, price, image, tags, isBestFor ,category ,setSelected,light_requirement,maintenance ,water_frequency ,selected}) => {

    const [token] = useCookie("token");
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [wishList, setWishList] = useState([])
    const [cartItem, setCartItem] = useState(() => {
    try {
        const savedCart = localStorage.getItem("leafly_cart");
        return savedCart ? JSON.parse(savedCart) : [];
    } catch {
        localStorage.removeItem("leafly_cart");
        return [];
    }
});
    const [isInCart, setIsInCart] = useState(false)

    
    useEffect(()=>{
        localStorage.setItem("leafly_cart",JSON.stringify(cartItem))
        window.dispatchEvent(new Event("cartUpdated"))
    },[cartItem])

    useEffect(() => {
        const fetchWishlist = async () => {
            const res = await fetch(`http://127.0.0.1:8000/api/wishlist/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            const data = await res.json();
            setWishList(data)
        }
        fetchWishlist();
    }, [])



    useEffect(() => {
        const isExist = wishList.some((item) => item.plant_id === Number(plant_id));
        setIsWishlisted(isExist)

    }, [wishList, plant_id])

    useEffect(()=>{
        const inCart = cartItem.some((item) => item.id === plant_id)
        setIsInCart(inCart)
    },[cartItem])







    const handleWhishlist = async () => {
        const payload = {
            plant_id: plant_id,
        }
        const res = await fetch(isWishlisted ? `http://127.0.0.1:8000/api/wishlist/${plant_id}` : `http://127.0.0.1:8000/api/wishlist/`,
            {
                method: isWishlisted ? 'DELETE' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                ...(isWishlisted ? {}
                    :
                    {
                        body: JSON.stringify(payload)
                    }
                )
            }
        );

        const result = await res.json();


        if (res.ok) {
            setIsWishlisted(!isWishlisted)
        }
    }

    const handleAddToCart=()=>{
        
        setCartItem((prev)=>{
            const exists=prev.some((item)=> item.id === plant_id);
            if(exists)
            {
                return prev.filter((item)=>item.id !== plant_id)
            }
            return [
                ...prev,
                {
                    id : plant_id,
                    name: name,
                    price:price,
                    image:image,
                    category:category,
                    quantity: 1,
                },
            ]
        })

        console.log(cartItem);
        

        console.log(isInCart);
        
    }

    
    const handleSelected=()=>{
        setSelected(
            {
                id : plant_id,
                name: name,
                price:price,
                image_url:image,
                category:category,
                light_requirement:light_requirement,
                maintenance:maintenance,
                water_frequency:water_frequency,
                tags:tags
            }
        )
    }

   


    const isInSelected=(selected?.id === plant_id)

    

    return (
        <div onClick={handleSelected} className={`flex flex-col gap-4 p-4 border ${isInSelected ? 'border-border-focus' : 'border-gray-200'} rounded-xl bg-white hover:shadow-md transition-shadow`}>
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
                    <div className="flex items-center gap-2">

                        <button
                            onClick={handleWhishlist}
                            className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-500 transition-all duration-200" aria-label="Add to wishlist">
                            <Heart
                                className={`w-4 h-4 transition-all duration-200 ${isWishlisted
                                        ? 'fill-red-600 text-red-600'
                                        : 'fill-none'
                                    }`}
                            />
                        </button>

                        <button
                            
                            onClick={handleAddToCart}
                            className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200
                                ${isInCart
                                    ? 'bg-[#E8F0E7] text-[#4A6A48] cursor-default'
                                    : 'bg-[#2B7A4B] text-white hover:bg-[#22643D] hover:shadow-md active:scale-95'
                                }`}
                                >
                                {isInCart ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    <span>Added</span>
                                </>
                                ) : (
                                <>
                                    <ShoppingCart className="w-4 h-4" />
                                    <span>Add to Cart</span>
                                </>
                                )}
                        </button>

                    </div>

                </div>
            </div>
        </div>

    )
}

export default ProductCard