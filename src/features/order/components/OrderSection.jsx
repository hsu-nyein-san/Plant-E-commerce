import React, { useState } from 'react'
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, ShoppingBag, Truck, XCircle, Package } from 'lucide-react'
import OrderItem from './OrderItem'
import { Link } from 'react-router-dom';

const OrderSection = ({ order }) => {

    const statusStyles = {
        pending: {
            label: "Pending",
            icon: Clock3,
            color: "bg-amber-50 text-amber-700 ring-amber-200",
        },
        processing: {
            label: "Processing",
            icon: Package,
            color: "bg-blue-50 text-blue-700 ring-blue-200",
        },
        in_transit: {
            label: "In Transit",
            icon: Truck,
            color: "bg-violet-50 text-violet-700 ring-violet-200",
        },
        delivered: {
            label: "Delivered",
            icon: CheckCircle2,
            color: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        },
        cancelled: {
            label: "Cancelled",
            icon: XCircle,
            color: "bg-red-50 text-red-700 ring-red-200",
        },
    };

    const currentStatus = String(order.order_status || "pending")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "_");


    const status = statusStyles[currentStatus] || statusStyles.pending;
    const StatusIcon = status.icon;

    return (
        <article className="border-b border-gray-100 p-5 transition hover:bg-[#FCFBF9] sm:p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                    <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-semibold text-gray-900">
                            Order #{order.order_number}
                        </h3>
                        {/* <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF4E9] px-3 py-1 text-xs font-medium text-[#34734A]">
                            <CheckCircle2 size={14} />
                            {order.status}
                        </span> */}
                        <span className={`inline-flex items-center gap-1.5 rounded-full bg-[#FFF3DC] px-3 py-1 text-xs font-medium ${status.color}`}>
                            <StatusIcon size={14} />
                            {status.label}
                        </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 sm:text-sm">
                        <span className="flex items-center gap-1.5">
                            <CalendarDays size={15} />
                            {
                                new Date(order.created_at).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })
                            }
                        </span>
                        <span className="flex items-center gap-1.5">
                            <ShoppingBag size={15} />
                            {order.items.length} items
                        </span>
                    </div>
                </div>

                <div className="sm:text-right">
                    <p className="text-xs text-gray-400">Order total</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                        ${order.total}
                    </p>
                </div>
            </div>

            <div className="mt-5 space-y-3">
                {
                    order.items?.map((item) => (
                        <OrderItem key={item.id} item={item} />
                    ))
                }


            </div>

            <div className="mt-5 flex flex-col justify-between gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle2 size={16} className="text-[#2B7A4B]" />
                    Payment: {order.status}
                </div>

                <Link to={`/my-orders/${order.id}`}>
                    
                    <button className=" flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-[#2B7A4B] hover:text-[#2B7A4B]">
                        View Details
                        <ArrowRight size={15} />
                    </button>
                </Link>
            </div>
        </article>
    )
}

export default OrderSection