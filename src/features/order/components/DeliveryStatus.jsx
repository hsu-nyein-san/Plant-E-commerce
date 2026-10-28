import { Truck } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const DeliveryStatus = ({ status }) => {
    const [step, setStep] = useState(0);

    const statusStepper = [
        {
            label: "Order Placed",
            value: "Your order has been received.",
        },
        {
            label: "Processing",
            value: "Your order is being prepared.",
        },
        {
            label: "In Transit",
            value: "Your order is on its way to you.",
        },
        {
            label: "Delivered",
            value: "Your order has been delivered successfully.",
        },
    ];


    useEffect(() => {
        if (!status?.order_status) return;

        if (status.order_status === "Pending") {
            setStep(0);
        } else if (status.order_status === "Processing") {
            setStep(1);
        } else if (status.order_status === "In Transit") {
            setStep(2);
        } else if (status.order_status === "Delivered") {
            setStep(3);
        }
    }, [status?.order_status]);



    return (
        <section className="rounded-2xl border border-[#EAE7DF] bg-[rgb(246,246,245)] p-5 sm:p-6">
            <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#E8F1E8] p-2.5">
                    <Truck size={20} className="text-[#2B7A4B]" />
                </div>
                <div>
                    <h2 className="font-semibold text-[#26372D]">
                        Delivery Status
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Your order is being processed.
                    </p>
                </div>
            </div>

            <div className="mt-5 space-y-4">
                {
                    statusStepper.map((statusStep, idx) => (
                        <div className="flex items-start gap-3" key={idx}>
                            <span className={`mt-1 h-3 w-3 rounded-full  ${idx <= step ? 'bg-[#2B7A4B] ' : 'bg-gray-100 border border-gray-400'}`} />
                            <div>
                                <p className="text-sm font-medium text-gray-800">
                                    {statusStep.label}
                                </p>
                                <p className="mt-1 text-xs text-gray-400">
                                    {statusStep.value}
                                </p>
                            </div>
                        </div>
                    ))
                }

                
            </div>
        </section>
    )
}

export default DeliveryStatus