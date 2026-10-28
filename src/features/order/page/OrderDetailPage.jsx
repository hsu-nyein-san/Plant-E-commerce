import { ArrowLeft, Leaf, MapPin, Truck } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import useCookie from 'react-use-cookie';
import ItemsOrder from '../components/ItemsOrder';
import ShippingInfoSection from '../components/ShippingInfoSection';
import OrderSummarySection from '../components/OrderSummarySection';
import DeliveryStatus from '../components/DeliveryStatus';
import toast from 'react-hot-toast';

const OrderDetailPage = () => {
    const { id } = useParams();
    const [token] = useCookie("token");
    const [orderDetail, setOrderDetail] = useState([])

    useEffect(() => {
        const fetchOrderDetail = async () => {
            const res = await fetch(`http://127.0.0.1:8000/api/orders/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            const data = await res.json();

            setOrderDetail(data)

        }
        fetchOrderDetail();
    }, [])

    const statusStyles = {
        pending: {
            label: "Pending",
            color: "bg-amber-50 text-amber-700 ring-amber-200",
        },
        processing: {
            label: "Processing",
            color: "bg-blue-50 text-blue-700 ring-blue-200",
        },
        in_transit: {
            label: "In Transit",
            color: "bg-violet-50 text-violet-700 ring-violet-200",
        },
        delivered: {
            label: "Delivered",
            color: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        },
        cancelled: {
            label: "Cancelled",
            color: "bg-red-50 text-red-700 ring-red-200",
        },
    };

    const clear_status = String(orderDetail.order_status || 'pending').toLowerCase().trim().replace(/\s+/g, "_");

    const statusColor = statusStyles[clear_status] || 'pending'

    const handleCancle=async()=>{
        const res=await fetch(`http://127.0.0.1:8000/api/orders/${id}/order_status`,
            {
                method:"PATCH",
                headers:{
                    Authorization : `Bearer ${token}`,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    order_status: "cancelled"
                })
            }
        )
        const result=await res.json;
        toast.success(result.message)        
    }


    return (
        <div className="min-h-screen bg-white px-4 py-8 sm:px-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <Link
                        to="/my-orders"
                        className="mb-5 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#2B7A4B]"
                    >
                        <ArrowLeft size={18} />
                        Back to My Orders
                    </Link>

                    <div className="flex flex-wrap items-center justify-between  gap-3">
                        <div>
                            <h1 className="text-2xl font-semibold text-[#26372D]">
                                Order Details
                            </h1>
                            <p className="mt-2 text-sm text-gray-500">
                                Order #{orderDetail.order_number}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <span className={`rounded-full px-4 py-2 text-sm font-medium ${statusColor.color}`}>
                                {orderDetail.order_status}
                            </span>
                            {(orderDetail.order_status === "pending" ||
                                orderDetail.order_status === "processing") && (
                                    <button
                                        type="button"
                                        onClick={()=>handleCancle()}
                                        className="rounded-lg border border-red-200 bg-white px-4 py-2
                                        text-sm font-medium text-red-600
                                        transition hover:bg-red-50 hover:border-red-300"
                                    >
                                        Cancel Order
                                    </button>
                                )}
                        </div>

                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <section className="rounded-2xl border border-[#EAE7DF] bg-[rgb(246,246,245)] p-5 sm:p-6">
                            <h2 className="mb-5 text-lg font-semibold text-[#26372D]">
                                Items Ordered
                            </h2>

                            <div className="space-y-5">
                                {
                                    orderDetail.items?.map((detail) => (
                                        <ItemsOrder key={detail.id} items={detail} />
                                    ))
                                }
                            </div>
                        </section>

                        <ShippingInfoSection detail={orderDetail} />
                    </div>

                    <div className="space-y-6">
                        <OrderSummarySection summary={orderDetail} />
                        <DeliveryStatus status={orderDetail} />

                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetailPage