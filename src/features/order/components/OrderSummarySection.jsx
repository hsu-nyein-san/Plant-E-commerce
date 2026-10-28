import React from 'react'

const OrderSummarySection = ({ summary }) => {
    return (
        <section className="rounded-2xl border border-[#EAE7DF] bg-[rgb(246,246,245)] p-5 sm:p-6">
            <h2 className="mb-5 font-semibold text-[#26372D]">
                Order Summary
            </h2>

            <div className="space-y-4 text-sm">
                <div className="flex justify-between gap-3">
                    <span className="text-gray-500">Order Date</span>
                    <span className="text-right text-gray-800">
                        {
                            new Date(summary.created_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })
                        }
                    </span>
                </div>

                <div className="flex justify-between gap-3">
                    <span className="text-gray-500">Payment Method</span>
                    <span className="text-gray-800">{summary.payment_method=== 'COD' ? 'Cash On Delivery' : summary.payment_method}</span>
                </div>

                <div className="flex justify-between gap-3">
                    <span className="text-gray-500">Payment Status</span>
                    <span className="text-amber-700">{summary.status}</span>
                </div>
            </div>

            <div className="my-5 border-t border-gray-100" />

            <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-800">
                    Total
                </span>
                <span className="text-2xl font-semibold text-[#2B7A4B]">
                    ${summary.total}
                </span>
            </div>
        </section>
    )
}

export default OrderSummarySection