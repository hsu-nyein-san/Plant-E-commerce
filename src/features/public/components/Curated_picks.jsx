import React, { useEffect, useState } from 'react'
import Container from '../../../components/Container'
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../../components/Button';
import SectionTitle from './SectionTitle';
import { json, Link } from 'react-router-dom';
import Curated_pick_item from './Curated_pick_item';

const Curated_picks = ({pick}) => {
    const [products,setProducts] = useState([]);
    const [pagination,setPagination]=useState(null)
    const [page,setPage]=useState(1)
    const [isExist,setIsExist]=useState(false);
    const LIMIT=6;

    

    useEffect(()=>{
        const fetchPlant=async()=>{
        let res=null
        if(pick === "Best Sellers")
        {
            res=await fetch(`http://127.0.0.1:8000/api/plants/best-sellers?page=${page}&limit=${LIMIT}`)
        }
        else if (pick === "New Arrivals")
        {
            res=await fetch(`http://127.0.0.1:8000/api/plants/new-arrivals?page=${page}&limit=${LIMIT}`)
        }
        else if (pick === "Low Light")
        {
            res=await fetch(`http://127.0.0.1:8000/api/plants/low-light?page=${page}&limit=${LIMIT}`)
        }
        else if (pick === "Pet-Friendly Plants")
        {
            res=await fetch(`http://127.0.0.1:8000/api/plants/pet-friendly?page=${page}&limit=${LIMIT}`)
        }
         
        
       const data=await res?.json();


        if(res.ok)
        {
            setProducts(data.items)
        }
        setPagination({
          total: data.total,
          page: data.page,
          limit: data.limit,
          pages: data.pages,
          has_next: data.has_next,
          has_prev: data.has_prev,
        })
        
        
    }
    fetchPlant();
    })

    const goToPage=(newPage)=>{
        const target=Number(newPage);

        if(!Number.isInteger(target)) return
        if(target < 1) return
        if(target === page) return 
        if(pagination.page && target > pagination.pages) return

        setPage(target);
    }

    const handleCart=(plantId)=>{
        const isExisting=cartItem.some((item)=> item.id == plantId)

    }

    

    return (
        <Container>
            <section className="mb-16">
                <div className="flex justify-between items-end mb-6">
                    <SectionTitle title="Curated Picks" subtitle="Handpicked for light, space and style" />
                    <div className="flex gap-2 mb-6">
                        <button disabled={page <= 1} onClick={()=>goToPage(page-1)} className={`p-2 rounded-full border border-gray-200 hover:bg-gray-50 ${page > 1 ? 'text-gray-600' : 'text-gray-300 cursor-not-allowed'}`}><ChevronLeft size={20} /></button>
                        <button disabled={page >= pagination?.pages ?? 0} onClick={()=>goToPage(page+1)} className={`p-2 rounded-full border border-gray-200 hover:bg-gray-50 ${page < pagination?.pages ? 'text-gray-600' : 'text-gray-300 cursor-not-allowed'}`}><ChevronRight size={20} /></button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product)=>(
                        <Curated_pick_item key={product.id} product={product}/>
                    ))}
                </div>
            </section>
        </Container>
    )
}

export default Curated_picks