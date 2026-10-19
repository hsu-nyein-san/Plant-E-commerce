
import { useEffect, useState } from "react";
import {
    HiArrowLeft,
    HiEnvelope,
    HiMapPin,
    HiPencilSquare,
    HiPhone,
    HiUser,
} from "react-icons/hi2";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import useCookie from "react-use-cookie";

import BreadCrumb from "../../../components/BreadCrumb";
import Container from "../../../components/Container";
import toast from "react-hot-toast";

const PersonalInformationPage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [userCookie] = useCookie("user");
    const [userExist, setUserExist] = useState(false);
    const [addressId, setAddressId] = useState();
    

    const [userPhone, setUserPhone] = useState();
    const [token] = useCookie('token')


    // console.log(token);

    let user = null;

    try {
        user = userCookie ? JSON.parse(userCookie) : null;
    } catch {
        user = null;
    }

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            full_name: user?.full_name ?? "",
            email: user?.email ?? "",
            phone: "",
            address: "",
            city: "",
            region: ""
        },
    });
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("http://127.0.0.1:8000/api/addresses/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            const existUser = data.some((addr) => addr.user_id == user.id);
            const userAddress = data.find((addr) => addr.user_id == user.id);

            const response = await fetch("http://127.0.0.1:8000/api/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const phoneData = await response.json();

            setUserPhone(phoneData.phone);
            setUserExist(existUser);
            setAddressId(userAddress);

            if (userAddress?.id) {
                try {
                    const aRes = await fetch(
                        `http://127.0.0.1:8000/api/addresses/${userAddress.id}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    const aData = await aRes.json();

                    

                    reset({
                        phone: phoneData.phone ?? "",
                        address: aData?.address_line ?? "",
                        city: aData?.city ?? "",
                        region: aData?.region ?? "",
                    });
                } catch (e) {
                    console.error(e);
                }
            }
        };

        fetchData();
    }, [user?.id, token, reset]);


    const [form, setForm] = useState({
        address: user?.address ?? "",
        city: user?.city ?? "",
        region: user?.region ?? "",
    });


    const onSubmit = async (data) => {


        const payload = {
            email: data.email,
            full_name: data.name,
            phone: data?.phone || null
        }

        const res = await fetch('http://127.0.0.1:8000/api/auth/me', {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        });

        const payload1 = {
            recipient_name: user?.full_name,
            phone: data.phone,
            address_line: data.address,
            city: data.city,
            region: data.region,
        }




        const url = userExist
            ? `http://127.0.0.1:8000/api/addresses/${addressId.id}`
            : "http://127.0.0.1:8000/api/addresses/";

        const method = userExist ? "PATCH" : "POST";

        console.log(payload1);



        const res2 = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload1)
        })



        if (res.ok) {
            toast.success('Phone number updated successfully');
        }
        else {
            toast.error(res.status);
        }

        if (res2.ok) {
            toast.success('address updated successfully');
        }
        else {
            toast.error(res2.status);
        }


        setIsEditing(false);
    };

    const handleCancel = () => {
        reset({
            full_name: user?.full_name ?? "",
            email: user?.email ?? "",
            phone: user?.phone ?? "",
        });

        setForm({
            address: user?.address ?? "",
            city: user?.city ?? "",
            region: user?.region ?? "",
        });

        setIsEditing(false);
    };

    return (
        <section className="min-h-screen bg-surface pb-16">
            <Container>
                <div className="pt-6">
                    <BreadCrumb currentPageTitle="Personal Information" />
                </div>

                <div className="mb-8 mt-8">
                    <Link
                        to="/user-profile"
                        className="mb-5 inline-flex items-center gap-2 text-sm text-ink-secondary transition hover:text-brand"
                    >
                        <HiArrowLeft size={17} />
                        Back to My Account
                    </Link>

                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                        ACCOUNT SETTINGS
                    </p>

                    <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                        Personal Information
                    </h1>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-ink-secondary sm:text-base">
                        Manage your personal details and delivery information for
                        your Leafly orders.
                    </p>
                </div>

                <div className="mx-auto max-w-4xl">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="overflow-hidden rounded-3xl border border-border bg-surface-card shadow-soft"
                    >
                        <div className="flex flex-col justify-between gap-4 border-b border-border-light p-6 sm:flex-row sm:items-center sm:p-8">
                            <div className="flex items-center gap-4">
                                <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand">
                                    <HiUser size={24} />
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold text-ink">
                                        Basic Information
                                    </h2>
                                    <p className="mt-1 text-sm text-ink-secondary">
                                        Your name and contact details.
                                    </p>
                                </div>
                            </div>

                            {!isEditing && (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-ink transition hover:border-brand hover:bg-brand-50 hover:text-brand"
                                >
                                    <HiPencilSquare size={17} />
                                    Edit Details
                                </button>
                            )}
                        </div>

                        <div className="space-y-8 p-6 sm:p-8">
                            <div className="flex items-center gap-4">
                                <img
                                    src={
                                        user?.profile_image ||
                                        "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                                    }
                                    alt="Profile"
                                    className="size-20 rounded-2xl border border-border object-cover"
                                />

                                <div>
                                    <h3 className="font-medium text-ink">
                                        Profile Photo
                                    </h3>
                                    <p className="mt-1 text-sm text-ink-secondary">
                                        Your profile picture on Leafly.
                                    </p>

                                    <Link
                                        to="/user-change-image"
                                        className="mt-2 inline-block text-sm font-medium text-brand hover:text-brand-hover"
                                    >
                                        Change photo
                                    </Link>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="full_name"
                                    className="mb-2 block text-sm font-medium text-ink"
                                >
                                    Full Name
                                    <span className="ml-1 text-error">*</span>
                                </label>

                                <div className="relative">
                                    <HiUser
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
                                    />

                                    <input
                                        id="full_name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        disabled={!isEditing}
                                        {...register("full_name", {
                                            required: "Full name is required",
                                            minLength: {
                                                value: 2,
                                                message: "Name must be at least 2 characters",
                                            },
                                        })}
                                        className="w-full rounded-xl border border-border bg-surface px-11 py-3 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-border-focus focus:ring-4 focus:ring-brand-50 disabled:cursor-default disabled:opacity-80"
                                    />
                                </div>

                                {errors.full_name && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.full_name.message}
                                    </p>
                                )}
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
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
                                    />

                                    <input
                                        id="email"
                                        type="email"
                                        readOnly
                                        {...register("email")}
                                        className="w-full cursor-default rounded-xl border border-border bg-surface px-11 py-3 text-sm text-ink outline-none opacity-80"
                                    />
                                </div>

                                <p className="mt-1 text-xs text-ink-muted">
                                    Email address cannot be edited here.
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="phone"
                                    className="mb-2 block text-sm font-medium text-ink"
                                >
                                    Phone Number
                                    <span className="ml-1 text-error">*</span>
                                </label>

                                <div className="relative">
                                    <HiPhone
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
                                    />

                                    <input
                                        id="phone"
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        disabled={!isEditing}
                                        {...register("phone", {
                                            minLength: {
                                                value: 7,
                                                message:
                                                    "Phone number must be at least 7 characters",
                                            }
                                        })}
                                        className="w-full rounded-xl border border-border bg-surface px-11 py-3 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-border-focus focus:ring-4 focus:ring-brand-50 disabled:cursor-default disabled:opacity-80"
                                    />
                                </div>

                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.phone.message}
                                    </p>
                                )}
                            </div>

                            <div className="border-t border-border-light pt-8">
                                <div className="mb-6 flex items-center gap-4">
                                    <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand">
                                        <HiMapPin size={23} />
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-semibold text-ink">
                                            Shipping Address
                                        </h2>
                                        <p className="mt-1 text-sm text-ink-secondary">
                                            Where you would like your plants delivered.
                                        </p>
                                    </div>
                                </div>
                                <div className="mb-5">
                                    <label
                                        htmlFor="address"
                                        className="mb-2 block text-sm font-medium text-ink"
                                    >
                                        Street Address
                                    </label>

                                    <input
                                        id="address"
                                        name="address"
                                        type="text"
                                        {...register('address')}
                                        disabled={!isEditing}
                                        placeholder="House number, street, township"
                                        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-border-focus focus:ring-4 focus:ring-brand-50 disabled:cursor-default disabled:opacity-80"
                                    />
                                </div>
                                <div className="mb-5">
                                    <label
                                        htmlFor="city"
                                        className="mb-2 block text-sm font-medium text-ink"
                                    >
                                        City / Township
                                    </label>

                                    <input
                                        id="city"
                                        name="city"
                                        type="text"
                                        {...register('city')}
                                        disabled={!isEditing}
                                        placeholder="e.g. Yangon"
                                        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-border-focus focus:ring-4 focus:ring-brand-50 disabled:cursor-default disabled:opacity-80"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="region"
                                        className="mb-2 block text-sm font-medium text-ink"
                                    >
                                        Region / State
                                    </label>

                                    <input
                                        id="region"
                                        name="region"
                                        type="text"
                                        {...register('region')}
                                        disabled={!isEditing}
                                        placeholder="Enter region or state"
                                        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-border-focus focus:ring-4 focus:ring-brand-50 disabled:cursor-default disabled:opacity-80"
                                    />
                                </div>
                            </div>
                            {isEditing && (
                                <div className="flex flex-col-reverse gap-3 border-t border-border-light pt-6 sm:flex-row sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="rounded-xl border border-border px-5 py-3 text-sm font-medium text-ink-secondary transition hover:bg-surface-hover"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-hover focus:outline-none focus:ring-4 focus:ring-brand-100"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>

                    <p className="mt-4 text-center text-xs leading-5 text-ink-muted">
                        Your personal information should be handled securely and used
                        only for appropriate account and order purposes.
                    </p>
                </div>
            </Container>
        </section>
    );
};

export default PersonalInformationPage;
