import { Heart, ShoppingCart } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Button from '../../../components/Button';

const WishlistItem = ({ plantId ,cart,setCart}) => {

    const [plant, setPlant] = useState([]);
    

    useEffect(() => {
        const fetchPlant = async () => {
            const res = await fetch("http://127.0.0.1:8000/api/plants");
            const data = await res.json();

            setPlant(data);
        }
        fetchPlant();
    }, [])

    

    const wishlistPlant = (plant?.items ?? []).filter((item) => {
        return plantId === item.id;
    });

    




    const handleAddToCart = (id, name, price, image,category) => {

        setCart((prev) => {
            const isInCart = prev.some((item) => item.id === id);

            if (isInCart) {
                return prev.filter((item) => item.id !== id);
            }

            return [
                ...prev,
                {
                    id : id,
                    name: name,
                    price:price,
                    image:image,
                    category:category,
                    quantity: 1,
                },
            ];
        });


    }
    return (
        <div>
            {
                wishlistPlant.map((item) => (
                    <article key={item.id} className="group overflow-hidden rounded-lg border border-black bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_-20px_rgba(48,66,45,0.22)]">
                        <div className="relative m-3 mb-0 overflow-hidden rounded-lg bg-[#EAEDE3]">
                            <img
                                src={item.image_url}
                                alt="Monstera Deliciosa"
                                className="h-64 w-full object-cover transition duration-700 group-hover:scale-105 md:h-72"
                            />

                            <div className="absolute left-4 top-4 rounded-lg bg-black px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white backdrop-blur-sm">
                                {
                                    item.maintenance
                                }
                            </div>

                            <button
                                type="button"
                                aria-label="Remove Monstera Deliciosa"
                                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#FFFDF9]/95 text-[#C85E58] shadow-sm transition hover:scale-110 hover:bg-white"
                            >
                                <Heart size={19} fill="currentColor" strokeWidth={1.7} />
                            </button>
                        </div>
                        <div className="p-5 pt-5 md:p-6">
                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#91A087]">
                                {item.subtitle}
                            </p>
                            <h3 className="font-sans text-lg font-bold transition group-hover:text-[#2B7A4B]">
                                {
                                    item.name
                                }
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-[#85877D]">
                                {
                                    item.description
                                }
                            </p>

                            <div className="my-5 h-px bg-[#EEEAE1]" />

                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-[#9A9A8D]">
                                        Price
                                    </p>
                                    <p className="mt-1 text-lg font-semibold text-[#2B7A4B]">
                                        ${item.price}
                                    </p>
                                </div>
                                <Button
                                    text={
                                        cart.some((added) => added.id === item.id)
                                            ? "Added to Cart"
                                            : "Add to Cart"
                                    }
                                    icon={ShoppingCart}
                                    variant="dark"
                                    onClick={() => handleAddToCart(item.id, item.name, item.price, item.image_url,item.category)}
                                />
                            </div>
                        </div>
                    </article>
                ))
            }
        </div>
    )
}

export default WishlistItem