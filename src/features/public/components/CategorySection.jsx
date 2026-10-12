import React from 'react'
import Container from '../../../components/Container';

const categories = [
    { title: 'Best Sellers', desc: 'Top-loved plants from our collection', img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=150&h=150' },
    { title: 'New Arrivals', desc: 'Fresh selections every month' },
    { title: 'Low Light', desc: 'Perfect choices for shaded rooms' },
    { title: 'Care Kits', desc: 'Tools & nutrients to keep them thriving' },
];

const CategorySection = () => {
    return (
        <Container>
            <section className="grid grid-cols-1 py-10 md:grid-cols-2 font-heading lg:grid-cols-4 gap-4">

                {categories.map((cat, idx) => (
                    <div key={idx} className="bg-white px-4 py-6 rounded-2xl flex gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        {cat.img && (
                            <img src={cat.img} alt={cat.title} className="w-12 h-12 rounded-lg object-cover" />
                        ) }
                        <div>
                            <h3 className="font-semibold text-ink text-lg">{cat.title}</h3>
                            <p className="text-sm text-ink-muted pt-1">{cat.desc}</p>
                        </div>
                    </div>
                ))}
            </section>
        </Container>

    )
}

export default CategorySection