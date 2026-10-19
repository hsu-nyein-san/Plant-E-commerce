import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  HiArrowRight,
  HiArrowRightOnRectangle,
  HiCheckCircle,
  HiEnvelope,
  HiHeart,
  HiLockClosed,
  HiPencilSquare,
  HiShoppingBag,
  HiSparkles,
  HiUser,
} from "react-icons/hi2";

import { Link, useNavigate } from "react-router-dom";
import useCookie from "react-use-cookie";

const UserProfileCard = () => {
  const [userCookie, setUserCookie] = useCookie("user", "");
  const [token, setToken] = useCookie("token", "");
  const [profileImage, setProfileImage] = useState(null);
  const navigate=useNavigate();

  let user = null;

  

  try {
    user = userCookie ? JSON.parse(userCookie) : null;
  } catch {
    user = null;
  }

  const name = user?.full_name || "Plant Lover";
  const email = user?.email || "No email available";

  const avatar =
    user?.profile_image ||
    "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";

  const accountCards = [
    {
      title: "Personal Information",
      description:
        "Manage your name and personal account details.",
      label: "View details",
      icon: HiUser,
      to: "/user-profile/personal-information",
    },
    {
      title: "Password & Security",
      description:
        "Keep your account protected with a secure password.",
      label: "Manage security",
      icon: HiLockClosed,
      to: "/user-profile/change-password",
    },
  ];

  const shoppingCards = [
    {
      title: "My Orders",
      description: "View your purchases and track your orders.",
      icon: HiShoppingBag,
      to: "/my-orders",
      background: "bg-[#EDF3E8]",
    },
    {
      title: "My Wishlist",
      description: "Keep your favorite plants close at hand.",
      icon: HiHeart,
      to: "/wishlist",
      background: "bg-[#F6EEEA]",
    },
  ];

  useEffect(()=>{
    const fetchImage=async()=>{
      try {
        const res=await fetch('http://127.0.0.1:8000/api/auth/me',{
          headers:{
            Authorization: `Bearer ${token}`,
          }
        });
        const data=await res.json();

        console.log(data.profile_image);
        setProfileImage(data.profile_image);
        
      } catch (error) {
        console.log(error.message);
        
      }
    }
    fetchImage();
  },[])

  const handleLogout=async()=>{
    try {
      const res=await fetch("http://127.0.0.1:8000/api/auth/logout",{
      method:"POST",
      headers:{
        Authorization: `Bearer ${token.trim()}`,
      }
    });

    const data=await res.json();
    

    if(res.ok)
    {
      setUserCookie("");
      setToken("")
      toast.success(data.message)
      navigate("/")
    }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">

      
      <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            <HiSparkles size={16} />
            Leafly Account Center
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Your little corner
            <br className="sm:hidden" /> of Leafly.
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-6 text-ink-secondary sm:text-base">
            Manage your account, keep track of your orders,
            and find your favorite plants.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-full border border-border bg-surface-card px-4 py-2 text-sm text-ink-secondary sm:self-auto">
          <span className="size-2 rounded-full bg-emerald-500" />
          Your account
        </div>
      </header>

      <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#193D32] text-white shadow-xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-24 -z-10 size-72 rounded-full border border-white/10 sm:size-96"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 right-20 -z-10 size-64 rounded-full bg-[#769878]/20 blur-3xl"
        />

        <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative w-fit shrink-0">
              <img
                src={
                  profileImage ? `http://127.0.0.1:8000${profileImage}` : "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                }
                alt={`${name}'s profile`}
                className="size-24 rounded-[1.75rem] border border-white/20 object-cover shadow-lg sm:size-32"
              />

              <span
                className="absolute -bottom-2 -right-2 flex size-8 items-center justify-center rounded-full border-4 border-[#193D32] bg-[#DDE9D7] text-[#193D32]"
                title="Leafly member"
              >
                <HiCheckCircle size={17} />
              </span>
            </div>

            <div className="min-w-0">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-[#B8CEBC]">
                YOUR PROFILE
              </p>

              <h2 className="break-words text-2xl font-semibold tracking-tight sm:text-3xl">
                Hello, {name}
              </h2>

              <p className="mt-3 flex items-start gap-2 break-all text-sm leading-6 text-white/70">
                <HiEnvelope
                  size={17}
                  className="mt-1 shrink-0"
                />
                {email}
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-[#E0EDDE]">
                <HiCheckCircle size={15} />
                Leafly Member
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to="/user-profile/edit-profile"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E0EBDD] px-5 py-3 text-sm font-semibold text-[#193D32] transition hover:bg-white"
            >
              <HiPencilSquare size={18} />
              Edit Profile
              <HiArrowRight size={16} />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <HiArrowRightOnRectangle size={18} />
              Logout
            </button>
          </div>


        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-black/10 px-6 py-4 sm:px-9 lg:px-12">
          <p className="text-sm text-white/70">
            Make yourself at home.
          </p>

          <p className="flex items-center gap-2 text-xs font-medium text-[#D4E4D2]">
            <HiSparkles size={15} />
            Bring Nature Home
          </p>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            ACCOUNT
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-ink">
            Manage your details
          </h2>

          <p className="mt-2 text-sm leading-6 text-ink-secondary">
            Everything you need to keep your account up to date.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {accountCards.map((item, index) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                to={item.to}
                className="group relative overflow-hidden rounded-3xl border border-border bg-surface-card p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`flex size-13 h-13 w-13 shrink-0 items-center justify-center rounded-2xl ${
                      index === 0
                        ? "bg-[#EAF1E6] text-[#416B4D]"
                        : "bg-[#E8EEEC] text-[#365D50]"
                    }`}
                  >
                    <Icon size={24} />
                  </div>

                  <span className="flex size-9 items-center justify-center rounded-full border border-border text-ink-muted transition group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                    <HiArrowRight
                      size={17}
                      className="transition group-hover:-rotate-45"
                    />
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-semibold text-ink">
                  {item.title}
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-ink-secondary">
                  {item.description}
                </p>

                <div className="mt-6 border-t border-border-light pt-4">
                  <span className="text-sm font-semibold text-brand">
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            YOUR COLLECTION
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-ink">
            Your plant shopping
          </h2>

          <p className="mt-2 text-sm leading-6 text-ink-secondary">
            Pick up where your plant journey left off.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {shoppingCards.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                to={item.to}
                className="group flex items-center gap-4 rounded-3xl border border-border bg-surface-card p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6"
              >
                <div
                  className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${item.background} text-[#365D43]`}
                >
                  <Icon size={25} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-ink">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-ink-secondary">
                    {item.description}
                  </p>

                  <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                    Explore
                    <HiArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <footer className="mt-10 border-t border-border-light pt-5">
        <p className="text-center text-xs leading-5 text-ink-muted">
          Made for your growing love of plants. 🌱
        </p>
      </footer>
    </main>
  );
};

export default UserProfileCard;