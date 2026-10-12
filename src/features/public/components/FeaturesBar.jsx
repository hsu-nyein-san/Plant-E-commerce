import React from 'react'
import Container from '../../../components/Container'

const FeaturesBar = () => {
    return (
        <Container>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-8 rounded-3xl shadow-sm mb-16">
                <div>
                    <h4 className="font-semibold text-ink text-sm">Fast, Reliable Delivery</h4>
                    <p className=" text-gray-500 mt-1 text-xs">Secure packaging and timing you can trust</p>
                </div>
                <div>
                    <h4 className="font-semibold text-ink text-sm">Plant Health Guarantee</h4>
                    <p className=" text-ink-muted mt-1 text-xs">Replacement or refund within 30 days</p>
                </div>
                <div>
                    <h4 className="font-semibold text-ink text-sm">Care Support</h4>
                    <p className=" text-ink-muted mt-1 text-xs">Expert advice via chat and guides</p>
                </div>
            </section>
        </Container>
    )
}

export default FeaturesBar