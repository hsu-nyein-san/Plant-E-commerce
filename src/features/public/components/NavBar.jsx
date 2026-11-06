import { Search, ShoppingCart, Menu, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useCookie from "react-use-cookie";
import Container from "../../../components/Container";
import Button from "../../../components/Button";
import PlantSearch from "./PlantSearch";

const NavBar = () => {
  const [user] = useCookie("user");
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = user && user.length !== 0;

  const closeMenu = () => setMenuOpen(false);

  const [cartItem,setCartItem]=useState(()=>{
    const cart=localStorage.getItem("leafly_cart")
    return cart ? JSON.parse(cart) : []
  })


  useEffect(()=>{
    const updateCart=()=>{
      const saved=localStorage.getItem("leafly_cart");
      setCartItem(saved ? JSON.parse(saved) : [] )
    }
    window.addEventListener("cartUpdated",updateCart);
    return ()=>window.removeEventListener("cartUpdated",updateCart)
  },[cartItem])

  



  return (
    <Container>
      <header className="font-heading">
        <nav className="max-w-7xl mx-auto py-4 sm:py-6 flex justify-between items-center">

          <Link
            to="/"
            onClick={closeMenu}
            className="text-2xl font-bold tracking-tight text-gray-900"
          >
            Leafly
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">

                        <PlantSearch />

            {isLoggedIn ? (
              <>
                <Link to="/user-profile" className="hover:text-gray-900">
                  Account
                </Link>

                <Link to="/wishlist" className="hover:text-gray-900">
                  Wishlist
                </Link>

                <Link to="/cart" className="relative hover:text-gray-900">
                  <ShoppingCart size={20} />
                  <span className="absolute -top-2 -right-2 bg-green-700 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItem.length}
                  </span>
                </Link>
              </>
            ) : (
              <Link to="/login">
                <Button text="Login" />
              </Link>
            )}

          </div>

          <div className="flex md:hidden items-center gap-4">

            
            <PlantSearch />

            {isLoggedIn && (
              <Link to="/cart" className="relative text-gray-700">
                <ShoppingCart size={20} />
                <span className="absolute -top-2 -right-2 bg-green-700 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItem.length}
                </span>
              </Link>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700"
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

          </div>
        </nav>

        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 flex flex-col gap-4 text-sm font-medium text-gray-600">

            {isLoggedIn ? (
              <>
                <Link to="/user-profile" onClick={closeMenu}>
                  Account
                </Link>

                <Link to="/wishlist" onClick={closeMenu}>
                  Wishlist
                </Link>
              </>
            ) : (
              <Link to="/login" onClick={closeMenu}>
                Login
              </Link>
            )}

          </div>
        )}

      </header>
    </Container>
  );
};

export default NavBar;
