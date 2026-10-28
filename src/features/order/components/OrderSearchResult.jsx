import { Search } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom';

const OrderSearchResult = ({ result }) => {
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

    const clear_status = String(result.order_status || pending).toLowerCase().trim()

    const status = statusStyles[clear_status] || "pending"

    return (
        <Link to={`/my-orders/${result.id}`}>
            <div className="flex items-center gap-4 p-4 transition hover:bg-gray-50">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EAF1E8]">
                    <Search size={20} className="text-[#2B7A4B]" />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-semibold text-gray-800">
                            #{result.order_number}
                        </h4>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium text-amber-700 ${status.color}`}>
                            {status.label}
                        </span>
                    </div>

                    <p className="mt-1 truncate text-sm text-gray-500">
                        {
                            result.items?.map((item) => (item.plant_name)).join(", ")
                        }

                    </p>
                    <p className="mt-1 truncate text-xs text-gray-400">
                        {result.user_email}
                    </p>
                </div>

                <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-[#2B7A4B]">
                        ${result.total}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">{result.items?.length} items</p>
                </div>
            </div></Link>
    )
}

export default OrderSearchResult