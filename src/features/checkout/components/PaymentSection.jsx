
import React, { useState } from 'react'
import SectionHeader from './SectionHeader'
import CheckoutField from './CheckoutField'
import { useForm } from 'react-hook-form'
import { Apple, CreditCard, Truck } from 'lucide-react'

const PaymentSection = ({ initialData = {}, onNext, onBack }) => {
    const [paymentMethod, setPaymentMethod] = useState(
        initialData.method || 'Card'
    )

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            cardNumber: initialData.cardNumber || '',
            cardName: initialData.cardName || '',
            expiry: initialData.expiry || '',
            cvv: initialData.cvv || '',
        },
        mode: 'onBlur',
    })

    const onSubmit = (data) => {
        if (paymentMethod === 'COD') {
            onNext?.({
                method: 'COD',
                cardNumber: '',
                cardName: '',
                expiry: '',
                cvv: '',
            })
            return
        }

        onNext?.({
            ...data,
            method: paymentMethod,
        })
    }

    const handleApplePay = () => {
        onNext?.({
            method: 'ApplePay',
            cardNumber: '',
            cardName: '',
            expiry: '',
            cvv: '',
        })
    }

    const handleGPay = () => {
        onNext?.({
            method: 'GPay',
            cardNumber: '',
            cardName: '',
            expiry: '',
            cvv: '',
        })
    }

    return (
        <form className="py-14" onSubmit={handleSubmit(onSubmit)}>
            <SectionHeader
                number="2"
                title="Payment"
                subtitle="Choose your preferred payment method."
            />

            <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => setPaymentMethod('Card')}
                        className={`flex items-center justify-center gap-2 rounded-md border p-4 transition-colors ${
                            paymentMethod === 'Card'
                                ? 'border-black bg-gray-100'
                                : 'border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        <CreditCard size={18} />
                        <span className="text-sm font-medium">Card</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setPaymentMethod('COD')}
                        className={`flex items-center justify-center gap-2 rounded-md border p-4 transition-colors ${
                            paymentMethod === 'COD'
                                ? 'border-black bg-gray-100'
                                : 'border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        <Truck size={18} />
                        <span className="text-sm font-medium">
                            Cash on Delivery
                        </span>
                    </button>
                </div>

                {paymentMethod === 'COD' ? (
                    <div className="rounded-md border border-gray-200 bg-gray-50 p-5">
                        <div className="flex items-start gap-3">
                            <Truck size={22} className="mt-1 shrink-0" />
                            <div>
                                <h3 className="font-medium text-gray-900">
                                    Pay when your order arrives
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    You can pay for your plants when the
                                    delivery arrives at your address. No card
                                    details are required.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <CheckoutField
                            label="Card number"
                            placeholder="1234567890123456"
                            error={errors.cardNumber?.message}
                            {...register('cardNumber', {
                                required: 'Card number is required',
                                pattern: {
                                    value: /^\d{13,19}$/,
                                    message: 'Enter 13–19 digits without spaces',
                                },
                            })}
                        />

                        <CheckoutField
                            label="Name on card"
                            placeholder="LINDA RHODES"
                            error={errors.cardName?.message}
                            {...register('cardName', {
                                required: 'Name on card is required',
                            })}
                        />

                        <div className="grid grid-cols-2 gap-5">
                            <CheckoutField
                                label="Expiry"
                                placeholder="MM/YY"
                                maxLength={5}
                                error={errors.expiry?.message}
                                {...register('expiry', {
                                    required: 'Expiry is required',
                                    pattern: {
                                        value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                                        message: 'Use MM/YY',
                                    },
                                })}
                            />

                            <CheckoutField
                                label="CVV"
                                placeholder="123"
                                maxLength={4}
                                error={errors.cvv?.message}
                                {...register('cvv', {
                                    required: 'CVV is required',
                                    pattern: {
                                        value: /^\d{3,4}$/,
                                        message: 'Invalid CVV',
                                    },
                                })}
                            />
                        </div>

                        <p className="text-xs text-gray-400">
                            Demo card form only. Connect a payment provider
                            before accepting real card payments.
                        </p>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={handleApplePay}
                                className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-200 py-3 hover:bg-gray-50"
                            >
                                <Apple size={18} />
                                <span className="text-sm font-medium">
                                    Apple Pay
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={handleGPay}
                                className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-200 py-3 hover:bg-gray-50"
                            >
                                <CreditCard size={18} />
                                <span className="text-sm font-medium">
                                    Google Pay
                                </span>
                            </button>
                        </div>
                    </>
                )}

                <div className="flex items-center justify-between pt-3">
                    <button
                        type="button"
                        onClick={onBack}
                        className="text-sm text-gray-500 hover:text-black"
                    >
                        Back to shipping
                    </button>

                    <button
                        type="submit"
                        className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                    >
                        Continue to review
                    </button>
                </div>

                <p className="text-center text-xs text-gray-400">
                    Your order details will be reviewed before placing
                    the order.
                </p>
            </div>
        </form>
    )
}

export default PaymentSection
