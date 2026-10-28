import React, { useEffect, useState } from "react";
import {
  Heart,
  Trash2,
  Leaf,
  ArrowRight,
  Sprout,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import useCookie from "react-use-cookie";
import WishlistItem from "../components/WishlistItem";
import { method } from "lodash";
import toast from "react-hot-toast";
import Container from "../../../components/Container";

const WishListPage = () => {

  const [token] = useCookie("token");
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("leafly_cart");
    try {
      const parsedCart = JSON.parse(savedCart);
      return Array.isArray(parsedCart) ? parsedCart : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('leafly_cart', JSON.stringify(cart));
  }, [cart])

  useEffect(() => {
    const fetchWishlist = async () => {
      const res = await fetch("http://127.0.0.1:8000/api/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json();
      setWishlist(data);
    };
    fetchWishlist();
  }, [])



  const clearWishList = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/wishlist", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        setWishlist([]); // Clear items from React state
        toast.success(result.message);
      } else {
        toast.error(result.detail || "Failed to clear wishlist");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };


  return (
    <Container>
      <div className="bg-white  text-[#26382C]">


      <section className="relative font-sans overflow-hidden border-b border-[#E8E5DB] bg-white">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#DCE7D8]/60 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-[#E7E4D7]/70 blur-3xl" />

        <div className="relative  py-12  md:py-16 ">
          {/* <Link
            to="/shop"
            className="mb-10 inline-flex items-center gap-2 text-sm text-[#687568] transition hover:text-[#2B7A4B]"
          >
            <ArrowLeft size={17} />
            Continue shopping
          </Link> */}
          {/* <BreadCrumb currentPageTitle="WishList"/> */}

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              

              <h1 className="text-2xl font-semibold mb-2 text-ink">
                Plants you <span className="italic text-[#2B7A4B]">love.</span>
              </h1>

              <p className="text-sm text-ink-secondary">
                A little corner for all the greenery that caught your eye.
                Keep your favorites close and bring your dream garden to life.
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white/80 bg-white/60 p-5 shadow-sm backdrop-blur-sm md:min-w-56">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5EFE6] text-[#2B7A4B]">
                <Heart size={23} strokeWidth={1.7} />
              </div>

              <div>
                <p className="font-sans text-3xl">{String(wishlist.length).padStart(2,"0")}</p>
                <p className="mt-1 text-xs text-[#7B8278]">
                  Plants saved for later
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <main className="py-10 md:py-14 ">

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#80907B]">
              Your favorites
            </p>
            <h2 className="font-heading text-2xl md:text-3xl">
              Saved with love
            </h2>
          </div>

          <button
            type="button"
            onClick={() => clearWishList()}
            className="inline-flex items-center gap-2 rounded-full border border-[#E5DCD4] bg-[#FFFDF9] px-4 py-2.5 text-sm text-[#81756F] transition hover:border-red-200 hover:text-red-500"
          >
            <Trash2 size={15} />
            Clear wishlist
          </button>
        </div>
        <div className={wishlist.length === 0 ? "" : "grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3"}>
          {
            wishlist.length !== 0 ? wishlist.map((item) => (
              (
                <WishlistItem plantId={item.plant_id} cart={cart} setCart={setCart} />
              )
            )) : (<div className="bg-brand-50 flex justify-center items-center w-full h-32 border border-brand rounded-md">
              <p className="text-xl text-center text-ink-muted">Your wishlist is empty.</p>
            </div>)
          }
        </div>

        <section className="relative mt-14 overflow-hidden rounded-[1.75rem] bg-[#2B4A35] px-6 py-10 text-center text-white md:px-12 md:py-12">
          <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full border border-white/10" />
          <div className="absolute -bottom-20 -right-10 h-56 w-56 rounded-full border border-white/10" />

          <div className="relative mx-auto max-w-2xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10">
              <Sprout size={24} strokeWidth={1.5} />
            </div>

            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.25em] text-[#D1DFC9]">
              A little note from Leafly
            </p>

            <h2 className="font-sans text-3xl leading-snug md:text-4xl">
              Make room for a little more green.
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#D9E0D6]">
              The perfect plant is waiting to find its home.
              Explore our collection and find your next leafy companion.
            </p>

            <Link
              to="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#FFFDF9] px-6 py-3.5 text-sm font-medium text-[#2B4A35] transition hover:bg-[#E8EEDF]"
            >
              Explore plants
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        <div className="mt-8 flex items-center justify-center gap-2 pb-4 text-xs text-[#929487]">
          <Leaf size={14} />
          <span>Growing happiness, one plant at a time.</span>
        </div>

      </main>
    </div>
    </Container>
  );
};

export default WishListPage;