import CategorySection from "../components/CategorySection";
import Curated_picks from "../components/Curated_picks";
import FeaturesBar from "../components/FeaturesBar";
import HeroSection from "../components/HeroSection";
import NavBar from "../components/NavBar";

const HomePage = () => {
  return (
    <>
      <div className="bg-surface font-heading">
        <NavBar/>
        <HeroSection />
        <CategorySection />
        <Curated_picks />
        <FeaturesBar />
      </div>
    </>
  );
};

export default HomePage;
