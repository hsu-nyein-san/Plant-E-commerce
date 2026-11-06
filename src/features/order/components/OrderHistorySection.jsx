import { ArrowRight, CalendarDays, CheckCircle2, Clock3, Search, ShoppingBag, Truck } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import useCookie from 'react-use-cookie'
import OrderSection from './OrderSection';
import OrderSearch from './OrderSearch';

const OrderHistorySection = () => {
    const [userCookie] = useCookie("user");
    const [token] = useCookie("token")
    const [orders, setOrders] = useState([]);
    const [activeStatus, setActiveStatus] = useState("All Orders");



    const user = userCookie ? JSON.parse(userCookie) : [];

    useEffect(() => {
        const fetchOrder = async () => {
            const res = await fetch('http://127.0.0.1:8000/api/orders/',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            const data = await res.json();
            if (res.ok) {
                setOrders(data)
            }
        }
        fetchOrder();
    }, [])

    const handleSearchStatus = async (status = "") => {
        const allOrders = (status.length == 0)
        const res = await fetch(allOrders ? `http://127.0.0.1:8000/api/orders/` : `http://127.0.0.1:8000/api/orders/status/${status}`,
            {
                headers:
                {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        const data = await res.json();

        setOrders(data)

    }


    return (
        <section className="overflow-hidden rounded-2xl border border-[#EAE6DF] bg-white">

            <div className="border-b border-gray-100 p-5 sm:p-6">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Order History
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Review your recent purchases
                        </p>
                    </div>

                    <OrderSearch />
                </div>

                <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
                    {
                        [
                            "All Orders",
                            "Pending",
                            "Processing",
                            "In Transit",
                            "Delivered",
                            "Cancelled"

                        ].map((status) => (
                            <button onClick={() => { setActiveStatus(status); handleSearchStatus(status === "All Orders" ? undefined : status) }} className={`whitespace-nowrap rounded-lg ${activeStatus === status ? "bg-[#2B7A4B] text-white" : "bg-[#F7F4EF] text-gray-600 hover:bg-[#EAE6DF]"} px-4 py-2 text-sm font-medium text-gray-600 hover:bg-[#EAE6DF]`}>
                                {status}
                            </button>
                        ))
                    }
                </div>
            </div>

            {orders && orders.length > 0 ? (
                orders.map((item) => (
                    <OrderSection key={item.id} order={item} />
                ))
            ) : (
                <div className="py-8 text-center text-sm text-gray-500">
                    There are no orders found.
                </div>
            )}


        </section>
    )
}

export default OrderHistorySection