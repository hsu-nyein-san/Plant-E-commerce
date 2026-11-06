import { useState } from "react";
import CategorySection from "../components/CategorySection";
import Curated_picks from "../components/Curated_picks";
import FeaturesBar from "../components/FeaturesBar";
import HeroSection from "../components/HeroSection";
import NavBar from "../components/NavBar";

const HomePage = () => {

  const [pick,setPick]=useState("Best Sellers");

  return (
    <>
      <div className="bg-surface font-heading">
        <NavBar/>
        <HeroSection />
        <CategorySection setPick={setPick}/>
        <Curated_picks pick={pick}/>
        <FeaturesBar />
      </div>
    </>
  );
};

export default HomePage;
