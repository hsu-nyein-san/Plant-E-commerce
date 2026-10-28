
import React, { useEffect, useState } from "react";
import {
  Heart,
  ShoppingCart,
  Package,
} from "lucide-react";
import Container from "../../../components/Container";
import { Link } from "react-router-dom";
import useCookie from "react-use-cookie";
import Button from "../../../components/Button";
import PlantSearch from "./PlantSearch";

const Header = () => {
  const [user] = useCookie("user");
  const [token] = useCookie("token");
  const [photo, setPhoto] = useState("");

  const isLoggedIn = Boolean(user && token);

  const cart = localStorage.getItem("leafly_cart");

  const cartItem = cart ? JSON.parse(cart) : [];
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token.trim()}`,
          },
        });

        if (!res.ok) return;

        const data = await res.json();
        setPhoto(data.profile_image || "");
      } catch (error) {
        console.error("Failed to fetch profile image:", error);
      }
    };

    if (isLoggedIn) {
      fetchImage();
    } else {
      setPhoto("");
    }
  }, [isLoggedIn, token]);

  const iconLinkClass =
    "relative flex items-center justify-center text-gray-600 hover:text-[#2B7A4B] transition-colors";

  return (
    <Container>
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between gap-4">

          <div className="flex items-center gap-8 lg:gap-10">
            <Link
              to="/"
              className="text-[22px] font-bold tracking-tight text-[#2B7A4B]"
            >
              Leafly
            </Link>

            <nav className="hidden items-center gap-6 md:flex lg:gap-8">
              <Link
                to="/"
                className="text-sm text-gray-600 transition-colors hover:text-[#2B7A4B]"
              >
                Home
              </Link>

              <Link
                to="/shop"
                className="text-sm text-gray-600 transition-colors hover:text-[#2B7A4B]"
              >
                Shop
              </Link>

              <Link
                to="/plant-finder"
                className="text-sm text-gray-600 transition-colors hover:text-[#2B7A4B]"
              >
                Plant Finder
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden sm:block">
              <PlantSearch />
            </div>
            <Link
              to="/cart"
              className={`${iconLinkClass} relative`}
              aria-label="Shopping cart"
              title="Cart"
            >
              <ShoppingCart size={21} strokeWidth={1.7} />

              {cartItem.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2B7A4B] px-[0.6px] text-xs text-white">
                  {cartItem.length}
                </span>
              )}
            </Link>

            {isLoggedIn && (
              <Link
                to="/wishlist"
                className={iconLinkClass}
                aria-label="Wishlist"
                title="Wishlist"
              >
                <Heart size={21} strokeWidth={1.7} />
              </Link>
            )}

            {isLoggedIn && (
              <Link
                to="/my-orders"
                className={iconLinkClass}
                aria-label="My orders"
                title="My Orders"
              >
                <Package size={21} strokeWidth={1.7} />
              </Link>
            )}

            {isLoggedIn ? (
              <Link
                to="/user-profile"
                aria-label="User profile"
                title="My Profile"
                className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200"
              >
                <img
                  src={
                    photo
                      ? `http://127.0.0.1:8000${photo}`
                      : "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                  }
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </Link>
            ) : (
              <Link to="/login" className="shrink-0">
                <Button variant="dark" text="Sign in" />
              </Link>
            )}
          </div>
        </div>
      </header>
    </Container>
  );
};

export default Header;
