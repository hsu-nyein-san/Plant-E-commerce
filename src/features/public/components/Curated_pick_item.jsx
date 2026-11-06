import React, { useEffect, useState } from 'react'
import Button from '../../../components/Button'
import { Link } from 'react-router-dom'

const Curated_pick_item = ({ product }) => {
    const [cartItem,setCartItem] = useState(()=>{
            const cart=localStorage.getItem("leafly_cart")
            return cart ? JSON.parse(cart) : []
        });
    const [exitingItem, setExitingItem] = useState(false);
    

    useEffect(()=>{
        setExitingItem(cartItem.find((item)=>item.id == product.id))
    },[])

    useEffect(()=>{
        localStorage.setItem('leafly_cart',JSON.stringify(cartItem));
        window.dispatchEvent(new Event("cartUpdated"))
    },[cartItem])

    const handleCart=(plant)=>{
        setCartItem((prev)=>{
            const isInCart=prev.some((item)=> item.id == plant.id);
            if(isInCart)
            {
                return prev.filter((item)=> item.id != plant.id)
            }
            return [
                ...prev,
                {
                   id : plant.id,
                    name: plant.name,
                    price:plant.price,
                    image:plant.image,
                    category:plant.category,
                    quantity: 1,
                }

            ]
        })
        
    }



    
    return (
        <div key={product.id} className="bg-white p-6 rounded-3xl shadow-sm flex flex-col">
            <div className=" bg-white rounded-2xl mb-4 overflow-hidden relative">
                {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-[280px] " />
                ) : (
                    <div className="w-full h-[280px] bg-gray-50"></div>
                )}
            </div>

            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.desc}</p>
                </div>
                <span className="font-semibold text-gray-900">${product.price}</span>
            </div>

            <div className="mt-auto flex justify-between items-center">
                <Button onClick={() => handleCart(product)} variant="primary" text={cartItem.some((added)=> added.id == product.id) ? 'Added to Cart' : 'Add to Cart'} />
                <Link to={`/house-plants/${product.id}`}>
                    <Button text='Quick View' variant="secondary" /></Link>
            </div>
        </div>
    )
}

export default Curated_pick_item