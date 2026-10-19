import { Toaster } from "react-hot-toast";
import LoginFrom from "../components/LoginFrom";
import { Link } from "react-router-dom";

function LoginPage() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900">
        <img src="https://images.unsplash.com/photo-1466781783364-36c955e42a77?auto=format&fit=crop&q=80&w=1000" alt="Plants" className="absolute inset-0 w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-2 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
            <span className="text-2xl font-bold tracking-tight">Leafly</span>
          </div>
          <div className="text-white max-w-md">
            <h2 className="text-3xl font-semibold leading-tight mb-4">
              Bring nature home.
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Discover a curated collection of plants, pots, and care guides delivered with care to your doorstep.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
            <span className="text-2xl font-bold tracking-tight text-gray-900">Leafly</span>
          </div>
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-sm text-gray-500">Please enter your details to sign in.</p>
          </div>
          
          <LoginFrom />
          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?
            <Link to="/register" className="font-medium text-gray-900 hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
    </section>
  );
}

export default LoginPage;
