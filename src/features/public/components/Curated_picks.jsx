import React from 'react'
import Container from '../../../components/Container'
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../../components/Button';
import SectionTitle from './SectionTitle';

const Curated_picks = () => {
    const products = [
  {
    id: 1,
    name: 'Monstera Deliciosa',
    desc: 'Medium • Bright indirect',
    price: 79,
    img: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=600&h=600'
  },
  {
    id: 2,
    name: 'ZZ Plant',
    desc: 'Small • Low Light',
    price: 39,
    img: null // Represents the empty placeholder in the design
  },
  {
    id: 3,
    name: 'Snake Plant',
    desc: 'Large • Low-Med Light',
    price: 49,
    img: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?auto=format&fit=crop&q=80&w=600&h=600'
  }
];

    return (
        <Container>
            <section className="mb-16">
                <div className="flex justify-between items-end mb-6">
                    <SectionTitle title="Curated Picks" subtitle="Handpicked for light, space and style" />
                    <div className="flex gap-2 mb-6">
                        <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600"><ChevronLeft size={20} /></button>
                        <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600"><ChevronRight size={20} /></button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white p-6 rounded-3xl shadow-sm flex flex-col">
                            <div className=" bg-white rounded-2xl mb-4 overflow-hidden relative">
                                {product.img ? (
                                    <img src={product.img} alt={product.name} className="w-full h-[280px] " />
                                ) : (
                                    <div className="w-full h-[280px] bg-gray-50"></div> // Empty placeholder logic
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
                                <Button variant="primary" text="Add to Cart" />
                                <Button text='Quick View' variant="secondary"/>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </Container>
    )
}

export default Curated_picks