import React, { useEffect, useState } from 'react';

const ImageGallery = ({productId,productName='Plant'}) => {
    const productImages = [
        "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=200",
        "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=200",
        "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=200",
        "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=200",
    ];


    const API_BASE = `http://127.0.0.1:8000`;


    const mainImage = "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=1000";

    const [selectedImg, setSelectedImg] = useState('');
    const [galleryImages,setGalleryImages]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(null);

    useEffect(()=>{
        const fetchPlant=async () =>{
            try {
                setLoading(true);
            const res=await fetch(`${API_BASE}/api/plants/${productId}`);
            if (!res.ok) throw new Error(`Http ${res.status}`);

            const data =await res.json();
            // const plant= productId ? data.find ((p)=> p.id === Number(productId)) : data [0];
            // if (!plant) throw new Error('Plant Not found');
            const baseUrl = data.image_url?.startsWith('/')
                    ? `${API_BASE}${data.image_url}`
                    : data.image_url;

            const views = [
                    baseUrl,
                    `${baseUrl}&crop=entropy`,
                    `${baseUrl}&crop=faces`,
                    `${baseUrl}&crop=center`,
                ];

            
                setGalleryImages(views);
                setSelectedImg(views[0]);
            } catch (error) {
                console.error('Failed to load gallery:',error);
                
            }
            finally {
                setLoading(false);
            }
        };
        fetchPlant();
        
    },[productId]);

    if (loading) {
        return (
            <div className="flex-1 flex w-full justify-center items-center bg-gray-50 rounded-2xl aspect-square">
                <p className="text-gray-400 text-sm">Loading images…</p>
            </div>
        );
    }

    if (error || !selectedImg) {
        return (
            <div className="flex-1 flex w-full justify-center items-center bg-gray-50 rounded-2xl aspect-square">
                <p className="text-red-500 text-sm">Failed: {error}</p>
            </div>
        );
    }


    return (
        <div className="flex flex-col-reverse md:flex-row lg:gap-8 md:gap-20 h-full">
            <div className="flex md:flex-col  gap-3 overflow-x-auto md:overflow-visible">
                {galleryImages.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedImg(img)}
                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                            selectedImg === img 
                                ? 'border-black' 
                                : 'border-transparent hover:border-gray-300'
                        }`}
                    >
                        <img 
                            src={img} 
                            alt={`View ${idx+1}`} 
                            className="w-full h-full object-cover" 
                        />
                    </button>
                ))}
            </div>

            <div className="flex-1 flex w-full justify-center items-center bg-gray-50 rounded-2xl overflow-hidden aspect-square">
                <img
                    src={selectedImg}
                    alt={productName}
                    className="w-full h-full object-cover object-center"
                />
            </div>
        </div>
    );
};

export default ImageGallery;