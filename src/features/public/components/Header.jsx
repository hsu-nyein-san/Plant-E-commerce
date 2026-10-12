import React from 'react';
import { Search } from 'lucide-react';
import Container from '../../../components/Container';
import { Link } from 'react-router-dom';

const Header = () => {
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
                to="cart"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Cart
              </Link>
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

            <button className="bg-black text-white px-5 py-[7px] rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
              Sign in
            </button>
          </div>

        </div>
      </header>
    </Container>
  );
};

export default Header;