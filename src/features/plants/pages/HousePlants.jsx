import React, { useEffect, useState } from 'react';
import Container from '../../../components/Container';
import ImageGallery from '../components/ImageGallery';
import PlantInfo from '../components/PlantInfo';
import ReviewsSection from '../components/ReviewsSection';
import AccessoriesSection from '../components/AccessoriesSection';
import { useParams } from 'react-router-dom';

const HousePlants = () => {
    const {id}=useParams();
    const [plant,setPlant]=useState(null);
    const [loading,setLoading] =useState(true);
    const [error,setError] =useState(null);

    useEffect (()=>{
        const fetchPlant=async () =>{
            try {
                const res=await fetch(`http://127.0.0.1:8000/api/plants/${id}`);
                if (!res.ok) throw new Error(`Http ${res.status}`);
                const data =await res.json();

                console.log(data);
                
                
                setPlant(data);

            } catch (error) {
                console.error(error);
                setError(error.message);
            }
            finally {
                setLoading(false);
            }
        };
        fetchPlant();
    },[id]);

    if (loading) return <div className="p-10 text-gray-500">Loading…</div>;
    if (error || !plant) return <div className="p-10 text-red-500">Error: {error}</div>;


    return (
        <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 py-10">
                <div className="lg:col-span-6 flex items-start ">
                    <div className="w-full max-w-[600px]">
                        <ImageGallery productId={plant.id} productName={plant.name}/>
                    </div>
                </div>

                <div className="lg:col-span-6 flex flex-col">
                    <PlantInfo productId={plant.id} productName={plant.name}/>
                    <ReviewsSection />
                    <AccessoriesSection/>
                </div>
            </div>
        </Container>
    );
};

export default HousePlants;