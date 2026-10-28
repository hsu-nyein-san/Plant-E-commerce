import React, { useEffect, useState } from "react";
import {
  Heart,
  ShoppingCart,
  Package,
  Menu,
  X,
  Search,
} from "lucide-react";
import Container from "../../../components/Container";
import { Link, useLocation } from "react-router-dom";
import useCookie from "react-use-cookie";
import Button from "../../../components/Button";
import PlantSearch from "./PlantSearch";

const Header = () => {
  const [user] = useCookie("user");
  const [token] = useCookie("token");
  const [photo, setPhoto] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const location = useLocation();
  const isLoggedIn = Boolean(user && token);

  const [cartItem, setCartItem] = useState(() => {
    const cart = localStorage.getItem("leafly_cart");
    return cart ? JSON.parse(cart) : [];
  });

  useEffect(() => {
    const updateCart = () => {
      const saved = localStorage.getItem("leafly_cart");
      setCartItem(saved ? JSON.parse(saved) : []);
    };

    window.addEventListener("cartUpdated", updateCart);
    return () => window.removeEventListener("cartUpdated", updateCart);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

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

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/plant-finder", label: "Plant Finder" },
  ];

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <Container>
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-8 lg:gap-10">
            <Link
              to="/"
              className="text-[22px] font-bold tracking-tight text-[#2B7A4B]"
            >
              Leafly
            </Link>

            <nav className="hidden items-center gap-6 md:flex lg:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm transition-colors hover:text-[#2B7A4B] ${
                    isActive(link.to)
                      ? "font-medium text-[#2B7A4B]"
                      : "text-gray-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-5">
            <div className="hidden sm:block">
              <PlantSearch />
            </div>

            <button
              type="button"
              onClick={() => setMobileSearchOpen((v) => !v)}
              className={`${iconLinkClass} sm:hidden`}
              aria-label="Toggle search"
            >
              <Search size={21} strokeWidth={1.7} />
            </button>

            <Link
              to="/cart"
              className={iconLinkClass}
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
                className={`${iconLinkClass} hidden md:flex`}
                aria-label="Wishlist"
                title="Wishlist"
              >
                <Heart size={21} strokeWidth={1.7} />
              </Link>
            )}

            {isLoggedIn && (
              <Link
                to="/my-orders"
                className={`${iconLinkClass} hidden md:flex`}
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
              <Link to="/login" className="hidden shrink-0 sm:block">
                <Button variant="dark" text="Sign in" />
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="flex items-center justify-center text-gray-600 hover:text-[#2B7A4B] md:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X size={24} strokeWidth={1.7} />
              ) : (
                <Menu size={24} strokeWidth={1.7} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        {mobileSearchOpen && (
          <div className="border-t border-gray-100 px-4 py-3 sm:hidden">
            <PlantSearch />
          </div>
        )}

        {/* Mobile menu */}
        <div
          className={`overflow-hidden border-t border-gray-100 bg-white transition-[max-height,opacity] duration-300 ease-in-out md:hidden ${
            mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col gap-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-gray-50 hover:text-[#2B7A4B] ${
                  isActive(link.to)
                    ? "font-medium text-[#2B7A4B]"
                    : "text-gray-700"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isLoggedIn && (
              <>
                <div className="my-2 h-px bg-gray-100" />
                <Link
                  to="/wishlist"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#2B7A4B]"
                >
                  <Heart size={18} strokeWidth={1.7} />
                  Wishlist
                </Link>
                <Link
                  to="/my-orders"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#2B7A4B]"
                >
                  <Package size={18} strokeWidth={1.7} />
                  My Orders
                </Link>
              </>
            )}

            {!isLoggedIn && (
              <div className="mt-2 px-1 sm:hidden">
                <Link to="/login" className="block">
                  <Button variant="dark" text="Sign in" />
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>
    </Container>
  );
};

export default Header;