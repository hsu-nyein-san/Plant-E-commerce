import { Search, ShoppingCart } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import useCookie from "react-use-cookie";
import Container from "../../../components/Container";
import Button from "../../../components/Button";


const NavBar = () => {
  const [user] = useCookie("user");

console.log("raw cookie:", user);
console.log("type:", typeof user);



  return (
    <Container>
      <header className="font-heading">
      <nav className="max-w-7xl mx-auto py-6 flex justify-between items-center">
        <div className="text-2xl font-bold tracking-tight text-gray-900 text-[24px]">Leafly</div>
        <div className="flex items-center gap-6 text-[14px] font-medium text-gray-600">
          <button className="hover:text-gray-900">
            <Search size={20} />
          </button>
          { user.length === 0 ?
            (<Link to="/login"><Button text="Login" /></Link>) : 
            (
              <Link to="/user-profile">
                <button className="hover:text-gray-900">Account</button>
              </Link>
              
            )
          }
          {
            user.length !== 0 && (<>
            <button className="hover:text-gray-900">Wishlist</button>
          <button className="relative hover:text-gray-900">
            <ShoppingCart size={20} />
            <span className="absolute -top-2 -right-2 bg-green-700 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">1</span>
          </button></>)
          }
        </div>
      </nav>
    </header>
    </Container>
  );
};

export default NavBar;
