import { useForm } from "react-hook-form";
import {
    HiArrowLeft,
    HiCamera,
    HiCheckCircle,
    HiEnvelope,
    HiPhone,
    HiUser,
} from "react-icons/hi2";
import useCookie from "react-use-cookie";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRef } from "react";

const EditProfilePage = () => {

    const fileInputRef = useRef(null);

    const [userCookie] = useCookie("user");
    const [token] = useCookie("token");
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);


    const user = JSON.parse(userCookie) || null;

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm(
        {
            defaultValues: {
                full_name: user.full_name,
                email: user.email ?? "",
                phone: "",
            },
        }
    );


    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch('http://127.0.0.1:8000/api/auth/me',
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            const data = await res.json();
            setProfileImage(data.profile_image);



            reset(
                {
                    phone: data.phone ?? "",
                }
            )
        }
        fetchUser();
    }, [user?.id, token, reset])

    useEffect(() => {
    }, [selectedFile]);

    useEffect(() => {
    }, [previewImage]);


    const onhandleSubmit = async (data) => {
        const res = await fetch('http://127.0.0.1:8000/api/auth/me',
            {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        full_name: data.full_name,
                        email: data.email,
                        phone: data.phone
                    }
                )
            }
        )
        const result = await res.json();

        const formData = new FormData();
        formData.append("file", selectedFile);

        const res2 = await fetch('http://127.0.0.1:8000/api/auth/profile-image',
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData,
            }
        );

        const message = await res2.json();

        if (res.ok) {
            toast.success('Profile changes successfully')
        }
        else if (!res.ok) {
            toast.error(result.detail);
        }

        if (res2.ok) {
            toast.success(message.message)
        }
        else if (!res2.ok) {
            toast.error(message.detail);
        }



    }

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file.");
            return;
        }

        setSelectedFile(file);
        setPreviewImage(URL.createObjectURL(file));



    }


    return (
        <section className="min-h-screen bg-surface pb-16">
            <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-ink-secondary">
                    <Link
                        to="/"
                        className="transition hover:text-brand"
                    >
                        Home
                    </Link>

                    <span>/</span>

                    <Link
                        to="/user-profile"
                        className="transition hover:text-brand"
                    >
                        My Account
                    </Link>

                    <span>/</span>

                    <span className="font-medium text-ink">
                        Edit Profile
                    </span>
                </div>


                <header className="mb-8 mt-10">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                        YOUR PERSONAL SPACE
                    </p>

                    <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                        Edit Profile
                    </h1>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-ink-secondary sm:text-base">
                        Keep your personal details fresh and make your Leafly
                        experience feel more like you.
                    </p>
                </header>

                <div className="mb-6 overflow-hidden rounded-3xl border border-border bg-surface-card shadow-soft">
                    <div className="h-28 bg-gradient-to-r from-[#DCE9D8] via-[#EEF3E9] to-[#F7F5EE] sm:h-36" />

                    <div className="px-6 pb-7 sm:px-8">
                        <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end">
                            <div className="relative w-fit">
                                <img
                                    src={
                                        previewImage ||
                                        (profileImage
                                            ? `http://127.0.0.1:8000${profileImage}`
                                            : "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png")
                                    }
                                    alt="Profile"
                                    className="size-24 rounded-2xl border-4 border-surface-card bg-surface object-cover sm:size-28"
                                />

                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    aria-label="Change profile photo"
                                    className="absolute -bottom-2 -right-2 flex size-9 items-center justify-center rounded-xl bg-brand text-white shadow-md transition hover:bg-brand-hover"
                                >
                                    <HiCamera size={18} className="" />
                                    <input
                                        ref={fileInputRef}
                                        id="profile-image"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </button>
                            </div>

                            <div className="pb-1">
                                <h2 className="text-xl font-semibold text-ink">
                                    Your Profile Photo
                                </h2>

                                <p className="mt-1 text-sm leading-6 text-ink-secondary">
                                    Add a photo to personalize your account.
                                </p>

                                <p className="mt-2 text-xs text-ink-muted">
                                    JPG or PNG · Recommended square image
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <form action="" onSubmit={handleSubmit(onhandleSubmit)}>
                    <div className="overflow-hidden rounded-3xl border border-border bg-surface-card shadow-soft">
                        <div className="border-b border-border-light px-6 py-6 sm:px-8">
                            <div className="flex items-center gap-4">
                                <div className="flex size-12 items-center justify-center rounded-2xl bg-[#EAF1E6] text-brand">
                                    <HiUser size={23} />
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold text-ink">
                                        Personal Information
                                    </h2>

                                    <p className="mt-1 text-sm text-ink-secondary">
                                        Update your name and contact details.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 p-6 sm:p-8">
                            <div>
                                <label
                                    htmlFor="full_name"
                                    className="mb-2 block text-sm font-medium text-ink"
                                >
                                    Full Name
                                </label>

                                <div className="relative">
                                    <HiUser
                                        size={19}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
                                    />

                                    <input
                                        id="full_name"
                                        name="full_name"
                                        {...register("full_name")}
                                        type="text"
                                        placeholder="Enter your full name"
                                        className="w-full rounded-xl border border-border bg-surface px-11 py-3.5 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-brand focus:ring-4 focus:ring-brand-50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-ink"
                                >
                                    Email Address
                                </label>

                                <div className="relative">
                                    <HiEnvelope
                                        size={19}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
                                    />

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        {...register("email")}
                                        placeholder="Enter your email address"
                                        className="w-full rounded-xl border border-border bg-surface px-11 py-3.5 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-brand focus:ring-4 focus:ring-brand-50"
                                    />
                                </div>

                                <p className="mt-2 text-xs leading-5 text-ink-muted">
                                    Make sure you use an email address you can access.
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="phone"
                                    className="mb-2 block text-sm font-medium text-ink"
                                >
                                    Phone Number
                                    <span className="ml-2 font-normal text-ink-muted">
                                        (Optional)
                                    </span>
                                </label>

                                <div className="relative">
                                    <HiPhone
                                        size={19}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
                                    />

                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        {...register("phone")}
                                        placeholder="Enter your phone number"
                                        className="w-full rounded-xl border border-border bg-surface px-11 py-3.5 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-brand focus:ring-4 focus:ring-brand-50"
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-2xl bg-[#F0F5ED] p-4">
                                <HiCheckCircle
                                    size={20}
                                    className="mt-0.5 shrink-0 text-brand"
                                />

                                <div>
                                    <p className="text-sm font-medium text-[#31563B]">
                                        Your information matters
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-[#56715B]">
                                        Your personal details help us provide a better
                                        shopping experience.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col-reverse gap-3 border-t border-border-light pt-6 sm:flex-row sm:justify-end">
                                <Link
                                    to="/user-profile"
                                    className="inline-flex items-center justify-center rounded-xl border border-border px-6 py-3 text-sm font-medium text-ink-secondary transition hover:bg-surface-hover"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-hover focus:outline-none focus:ring-4 focus:ring-brand-100"
                                >
                                    <HiCheckCircle size={18} />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-surface-card p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div>
                        <h3 className="font-semibold text-ink">
                            Want to update your password?
                        </h3>

                        <p className="mt-1 text-sm text-ink-secondary">
                            Keep your account secure with a strong password.
                        </p>
                    </div>

                    <Link
                        to="/user-profile/change-password"
                        className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-brand transition hover:text-brand-hover"
                    >
                        Change Password
                        <HiArrowLeft
                            size={16}
                            className="rotate-180"
                        />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default EditProfilePage;
