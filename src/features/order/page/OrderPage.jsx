
import React, { useEffect, useState } from "react";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock3,
  XCircle,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Search,
  ChevronDown,
  Leaf,
  MapPin,
  CalendarDays,
  ReceiptText,
} from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../../../components/Container";
import OrderHistorySection from "../components/OrderHistorySection";
import useCookie from "react-use-cookie";




const OrderPage = () => {

  const [token] = useCookie("token")
  const [orders, setOrders] = useState([]);


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

   const activeOrders=orders.filter((order)=>
  ["Pending", "Processing", "In Transit"
  ].includes(order.order_status))

  const totalSpent=orders.filter((order)=>
  order.status.toLowerCase() === 'paid').reduce((total,order)=> total+order.total,0)

  return (
    <Container>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            

            <h1 className="text-2xl font-semibold mb-2 text-ink">
              My Orders
            </h1>

            
            

            <p className="text-sm text-ink-secondary">
              Keep track of your plants and every order you make.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#2B7A4B] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#21623B]"
          >
            <ShoppingBag size={17} />
            Continue Shopping
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mb-9 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-[#EAE6DF] bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF4E9] text-[#2B7A4B]">
                <Package size={21} />
              </div>
              <span className="text-xs font-medium text-gray-400">
                ALL TIME
              </span>
            </div>
            <p className="mt-5 text-3xl font-semibold text-gray-900">{orders.length}</p>
            <p className="mt-1 text-sm text-gray-500">Total orders</p>
          </div>

          <div className="rounded-2xl border border-[#EAE6DF] bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF3DC] text-[#A27A30]">
                <Truck size={21} />
              </div>
              <span className="text-xs font-medium text-gray-400">
                ON THE WAY
              </span>
            </div>
            <p className="mt-5 text-3xl font-semibold text-gray-900">{activeOrders.length}</p>
            <p className="mt-1 text-sm text-gray-500">Active orders</p>
          </div>

          <div className="rounded-2xl border border-[#EAE6DF] bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0EBFA] text-[#8065AE]">
                <ReceiptText size={21} />
              </div>
              <span className="text-xs font-medium text-gray-400">
                COMPLETED
              </span>
            </div>
            <p className="mt-5 text-2xl font-semibold text-gray-900">
              ${totalSpent.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-gray-500">Total spent</p>
          </div>

        </div>

        <OrderHistorySection />

        <div className="mt-6">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#2B7A4B]"
          >
            <ArrowRight size={16} className="rotate-180" />
            Back to shopping
          </Link>
        </div>

      </div>

    </Container>
  );
};

export default OrderPage;
