import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import Container from '../../../components/Container';
import { Link } from 'react-router-dom';
import useCookie from "react-use-cookie";
import Button from '../../../components/Button';


const Header = () => {
  const [user] = useCookie("user");
  const [token] = useCookie("token");
  const [photo, setPhoto] = useState();

  useEffect(() => {
    const fetchImage = async () => {
      const res = await fetch("http://127.0.0.1:8000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token.trim()}`
        }
      })
      const data = await res.json();

      setPhoto(data.profile_image)

    };
    fetchImage();
  }, [])
  return (
    <Container>
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto h-[72px] flex items-center justify-between">

          <div className="flex items-center gap-10">
            <a href="#" className="text-[22px] font-bold tracking-tight text-gray-900">
              Leafy
            </a>

            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Home
              </Link>
              <Link
                to="shop"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Shop
              </Link>
              <Link
                to="plant-finder"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Plant Finder
              </Link>
              <Link
                to="/cart"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Cart
              </Link>
              {
                user && (
                  <Link
                    to="wishlist"
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    Wishlist
                  </Link>
                )
              }
            </nav>
          </div>

          <div className="flex items-center gap-4">

            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search plants, e.g., Monstera"
                className="pl-9 pr-4 py-2 bg-[#f4f4f5] border border-transparent rounded-md text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-border-light focus:ring-1 focus:ring-border w-[260px] transition-all"
              />
            </div>
            {
              user.length === 0 ? (
                <link to="/login">
                  <Button variant="dark" text="Sign in" />
                </link>
              ) : (
                <Link to="/user-profile">
                  <div className="w-9 h-9">
                    <img src={
                      photo ? `http://127.0.0.1:8000${photo}` : `https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png`
                    } alt="" className=" rounded-full" />
                  </div>
                </Link>
              )
            }
          </div>

        </div>
      </header>
    </Container>
  );
};

export default Header;