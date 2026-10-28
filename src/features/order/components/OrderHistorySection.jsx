import { ArrowRight, CalendarDays, CheckCircle2, Clock3, Search, ShoppingBag, Truck } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import useCookie from 'react-use-cookie'
import OrderSection from './OrderSection';
import OrderSearch from './OrderSearch';

const OrderHistorySection = () => {
    const [userCookie] = useCookie("user");
    const [token] = useCookie("token")
    const [orders, setOrders] = useState([]);


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
                    <button onClick={() => handleSearchStatus()} className="whitespace-nowrap rounded-lg bg-[#2B7A4B] px-4 py-2 text-sm font-medium text-white">
                        All Orders
                    </button>
                    <button onClick={() => handleSearchStatus('Pending')} className="whitespace-nowrap rounded-lg bg-[#F7F4EF] px-4 py-2 text-sm font-medium text-gray-600">
                        Pending
                    </button>
                    <button onClick={() => handleSearchStatus('Processing')} className="whitespace-nowrap rounded-lg bg-[#F7F4EF] px-4 py-2 text-sm font-medium text-gray-600 hover:bg-[#EAE6DF]">
                        Processing
                    </button>
                    <button onClick={() => handleSearchStatus('In Transit')} className="whitespace-nowrap rounded-lg bg-[#F7F4EF] px-4 py-2 text-sm font-medium text-gray-600 hover:bg-[#EAE6DF]">
                        In Transit
                    </button>
                    <button onClick={() => handleSearchStatus('Delivered')} className="whitespace-nowrap rounded-lg bg-[#F7F4EF] px-4 py-2 text-sm font-medium text-gray-600 hover:bg-[#EAE6DF]">
                        Delivered
                    </button>
                    <button onClick={() => handleSearchStatus('Cancelled')} className="whitespace-nowrap rounded-lg bg-[#F7F4EF] px-4 py-2 text-sm font-medium text-gray-600 hover:bg-[#EAE6DF]">
                        Cancelled
                    </button>
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