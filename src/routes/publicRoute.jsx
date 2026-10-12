import { lazy } from "react";
import ShopPage from "../features/shop/pages/ShopPage";
import HousePlants from "../features/plants/pages/HousePlants";
import PlantFinderPage from "../features/plant-finder/pages/PlantFinderPage";
import CartPage from "../features/cart/pages/CartPage";
import CheckoutPage from "../features/checkout/pages/CheckoutPage";

const AboutUsPage = lazy(() => import("../features/public/pages/AboutUsPage"));
const ContactUsPage = lazy(() => import("../features/public/pages/ContactUsPage"));
const HomePage = lazy(() => import("../features/public/pages/HomePage"));

const publicRoute = [
  {
    path: "shop",
    element: <ShopPage />,
  },
  {
    path: "house-plants/:id",
    element:<HousePlants/>
  },
  {
    path: "plant-finder",
    element: <PlantFinderPage/>,
  },
  {
    path: "checkout",
    element: <CheckoutPage/>,
  },
  {
    path: "cart",
    element: <CartPage/>,
  },
  {
    path: "about-us",
    element: <AboutUsPage />,
  },
  {
    path: "contact-us",
    element: <ContactUsPage />,
  },
  
];

export default publicRoute;
