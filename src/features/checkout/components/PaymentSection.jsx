import React from 'react'
import SectionHeader from './SectionHeader'
import CheckoutField from './CheckoutField'
import { useForm } from 'react-hook-form'
import { Apple, CreditCard } from 'lucide-react'   // optional icons

const PaymentSection = ({ initialData = {}, onNext, onBack }) => {
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
        console.log(' Card payment:', data)
        onNext?.({ ...data, method: 'Card' })
    }


    const handleApplePay = () => {
        console.log(' Apple Pay clicked')

        const paymentData = {
            method: 'ApplePay',
            cardNumber: 'APPLE_PAY_TOKEN',
            cardName: 'Apple Pay User',
            expiry: '',
            cvv: '',
        }

        onNext?.(paymentData)
    }

    const handleGPay = () => {
        console.log(' G Pay clicked')

        const paymentData = {
            method: 'GPay',
            cardNumber: 'GPAY_TOKEN',
            cardName: 'Google Pay User',
            expiry: '',
            cvv: '',
        }

        onNext?.(paymentData)
    }

    return (
        <form className="py-14" onSubmit={handleSubmit(onSubmit)}>
            <SectionHeader
                number="2"
                title="Payment"
                subtitle="Secure card entry. We never store CVV."
            />

            <div className="space-y-5">

                <CheckoutField
                    label="Card number"
                    placeholder="1234 5678 9012 3456"
                    error={errors.cardNumber?.message}
                    {...register('cardNumber', {
                        required: 'Card number is required',
                        pattern: {
                            value: /^\d{13,19}$/,
                            message: 'Invalid card number',
                        },
                    })}
                />
                <p className="text-[10px] text-gray-400 -mt-4">
                    Supported: Visa, Mastercard, Amex, Apple Pay
                </p>
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
                        placeholder="MM / YY"
                        maxLength={5}
                        error={errors.expiry?.message}
                        {...register('expiry', {
                            required: 'Expiry required',
                            pattern: {
                                value: /^\d{2}\/\d{2}$/,
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
                            required: 'CVV required',
                            pattern: { value: /^\d{3,4}$/, message: 'Invalid CVV' },
                        })}
                    />
                </div>


                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="save-card"
                            className="accent-black"
                        />
                        <label htmlFor="save-card" className="text-xs text-gray-600">
                            Save card for future purchases
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
                    >
                        Continue to review
                    </button>
                </div>

                <div className="flex items-center gap-3 pt-4">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="text-xs text-gray-400">OR</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                </div>
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={handleApplePay}
                        className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-md py-2.5 hover:bg-gray-50 transition-colors"
                    >
                        <span className="text-sm font-medium"><Apple/>  Apple Pay</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleGPay}
                        className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-md py-2.5 hover:bg-gray-50 transition-colors"
                    >
                        <span className="text-sm font-medium"> <CreditCard /> G Pay</span>
                    </button>
                </div>
                <button
                    type="button"
                    onClick={onBack}
                    className="text-sm text-gray-500 hover:text-black"
                >
                    Back to shipping
                </button>

                <p className="text-[10px] text-gray-400 text-center">
                    We use 3D encryption and tokenization to protect your payment
                    details. Secure checkout.
                </p>
            </div>
        </form>
    )
}

export default PaymentSection