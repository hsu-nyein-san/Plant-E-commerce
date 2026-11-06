
import React, { useState } from "react";
import { CreditCard, Truck, ShieldCheck, CheckCircle2 } from "lucide-react";
import SectionHeader from "./SectionHeader";

const PaymentSection = ({ initialData = {}, onNext, onBack }) => {
    const [paymentMethod, setPaymentMethod] = useState(
        initialData.method || "2C2P"
    );

    const onSubmit = () => {
        onNext?.({
            method: paymentMethod,
            cardNumber: "",
            cardName: "",
            expiry: "",
            cvv: "",
        });
    };

    return (
        <div className="py-8 sm:py-14">
            <SectionHeader
                number="2"
                title="Payment"
                subtitle="Choose how you would like to pay for your order."
            />

            <div className="space-y-5">

                <button
                    type="button"
                    onClick={() => setPaymentMethod("2C2P")}
                    className={`w-full rounded-xl border p-4 sm:p-5 text-left transition-all ${paymentMethod === "2C2P"
                            ? "border-[#2B7A4B] bg-[#F7FAF6] ring-1 ring-[#2B7A4B]"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                >
                    <div className="flex items-center gap-3 sm:gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white border border-gray-100">
                            <CreditCard size={22} className="text-[#2B7A4B]" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                                Online Payment
                            </h3>
                            <p className="mt-1 text-xs sm:text-sm text-gray-500">
                                Secure payment powered by 2C2P
                            </p>
                        </div>

                        <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${paymentMethod === "2C2P"
                                ? "border-[#2B7A4B] bg-[#2B7A4B]"
                                : "border-gray-300"
                            }`}>
                            {paymentMethod === "2C2P" && (
                                <CheckCircle2 size={14} className="text-white" />
                            )}
                        </div>
                    </div>

                    {paymentMethod === "2C2P" && (
                        <div className="mt-4 border-t border-[#E4EDE1] pt-4">

                            <div className="flex items-start gap-2">
                                <ShieldCheck
                                    size={18}
                                    className="shrink-0 text-[#2B7A4B]"
                                />

                                <div>
                                    <p className="text-sm font-medium text-gray-800">
                                        Secure checkout with 2C2P
                                    </p>
                                    <p className="mt-1 text-xs leading-relaxed text-gray-500">
                                        You will be redirected to the secure
                                        2C2P payment page to complete your
                                        transaction.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                <span className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600">
                                    Visa
                                </span>
                                <span className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600">
                                    Mastercard
                                </span>
                                <span className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600">
                                    Other supported methods
                                </span>
                            </div>
                        </div>
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => setPaymentMethod("COD")}
                    className={`w-full rounded-xl border p-4 sm:p-5 text-left transition-all ${paymentMethod === "COD"
                            ? "border-[#2B7A4B] bg-[#F7FAF6] ring-1 ring-[#2B7A4B]"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                >
                    <div className="flex items-center gap-3 sm:gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white border border-gray-100">
                            <Truck size={22} className="text-gray-600" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                                Cash on Delivery
                            </h3>
                            <p className="mt-1 text-xs sm:text-sm text-gray-500">
                                Pay when your order arrives
                            </p>
                        </div>

                        <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${paymentMethod === "COD"
                                ? "border-[#2B7A4B] bg-[#2B7A4B]"
                                : "border-gray-300"
                            }`}>
                            {paymentMethod === "COD" && (
                                <CheckCircle2 size={14} className="text-white" />
                            )}
                        </div>
                    </div>

                    {paymentMethod === "COD" && (
                        <div className="mt-4 border-t border-[#E4EDE1] pt-4">
                            <p className="text-xs leading-relaxed text-gray-500">
                                Pay for your plants directly to the delivery
                                person when your order arrives. No card details
                                are required.
                            </p>
                        </div>
                    )}
                </button>

                <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 pt-5">

                    <button
                        type="button"
                        onClick={onBack}
                        className="text-sm text-gray-500 hover:text-gray-900"
                    >
                        Back to shipping
                    </button>

                    <button
                        type="button"
                        onClick={onSubmit}
                        className="w-full sm:w-auto rounded-lg bg-[#2B7A4B] px-8 py-3.5 text-sm font-medium text-white transition hover:bg-[#23653E]"
                    >
                        Continue to review
                    </button>

                </div>

                <p className="text-center text-xs text-gray-400">
                    Your payment information is handled securely by the payment provider.
                </p>

            </div>
        </div>
    );
};

export default PaymentSection;
