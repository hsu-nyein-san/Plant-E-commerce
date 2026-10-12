import React from 'react'
import Button from '../../../components/Button'
import CartItem from './CartItem';

const YourCartSection = ({items,updateQuantity,removeItem}) => {
    

    return (
        <div className="">
            <div className="flex lg:flex-row md:flex-col flex-col lg:justify-between lg:items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold mb-2 text-ink">Your Cart</h1>
                    <p className="text-sm text-ink-secondary">Review items, apply promo codes, and estimate shipping before checkout.</p>
                </div>
                <div className="hidden sm:flex gap-3 pt-4">
                    <Button text='Continue Shopping' variant='secondary' />
                    <Button variant='dark' text="Save for later" />
                </div>
            </div>
            <div className="w-full h-48 bg-gray-100 rounded-lg mb-8 overflow-hidden relative">
               <img 
                 src="https://images.unsplash.com/photo-1466781783364-36c955e42a77?auto=format&fit=crop&q=80&w=1000" 
                 alt="Plants banner" 
                 className="w-full h-full object-cover"
               />
            </div>

            <div className="border border-gray-200 rounded-lg p-6 mb-6">
               {items.map(item => (
                 <CartItem 
                   key={item.id} 
                   item={item} 
                   updateQuantity={updateQuantity} 
                   removeItem={removeItem}
                 />
               ))}
               {items.length === 0 && (
                 <p className="text-center text-gray-500 py-10">Your cart is empty.</p>
               )}
            </div>


        </div>
    )
}

export default YourCartSection