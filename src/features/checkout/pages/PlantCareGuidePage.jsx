import React from 'react'
import {
  Droplets,
  Sun,
  Sprout,
  Scissors,
  ThermometerSun,
  ArrowLeft,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const PlantCareGuidePage = () => {
    const careTips = [
  {
    icon: Droplets,
    title: 'Watering',
    description:
      'Check the soil moisture before watering. Water your plant when the top 2–3 cm of soil feels dry. Avoid overwatering.',
  },
  {
    icon: Sun,
    title: 'Sunlight',
    description:
      'Place your plant in a location with bright, indirect sunlight. Avoid exposing delicate leaves to harsh direct sunlight.',
  },
  {
    icon: Sprout,
    title: 'Soil & Fertilizer',
    description:
      'Use well-draining soil suitable for your plant type. Feed your plant with balanced fertilizer during its growing season.',
  },
  {
    icon: Scissors,
    title: 'Pruning',
    description:
      'Remove yellow, dry, or damaged leaves regularly. This helps maintain healthy growth and keeps your plant looking fresh.',
  },
  {
    icon: ThermometerSun,
    title: 'Temperature',
    description:
      'Keep your plant in a comfortable indoor environment. Avoid sudden temperature changes and cold drafts.',
  },
]

  return (
    <div className="min-h-screen bg-[#F7F4EF] px-4 py-10 sm:px-8">
      <div className="max-w-4xl mx-auto">

        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#2B7A4B] mb-8"
        >
          <ArrowLeft size={16} />
          Back to shop
        </Link>

        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">

          <div className="bg-[#2B7A4B] text-white px-6 py-12 sm:px-10">
            <p className="text-sm uppercase tracking-[0.2em] text-white/70 mb-3">
              Leafly Plant Care
            </p>

            <h1 className="text-3xl sm:text-4xl font-medium mb-4">
              Grow Happy, Healthy Plants
            </h1>

            <p className="text-sm sm:text-base text-white/80 max-w-xl leading-relaxed">
              A little care goes a long way. Follow these simple
              guidelines to help your plants thrive and bring
              more nature into your home.
            </p>
          </div>

          <div className="p-6 sm:p-10">

            <div className="mb-8">
              <h2 className="text-xl font-medium text-gray-900 mb-2">
                Essential Plant Care Tips
              </h2>

              <p className="text-sm text-gray-500">
                Follow these basic care practices to keep your
                indoor plants healthy and beautiful.
              </p>
            </div>

            <div className="space-y-7">
              {careTips.map((tip, index) => {
                const Icon = tip.icon

                return (
                  <div
                    key={index}
                    className="flex gap-4 items-start"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#F0F5F0] flex items-center justify-center shrink-0">
                      <Icon
                        size={21}
                        className="text-[#2B7A4B]"
                      />
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        {tip.title}
                      </h3>

                      <p className="text-sm text-gray-500 leading-relaxed">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-10 bg-[#F7F4EF] rounded-xl p-5 sm:p-6">
              <h3 className="font-medium text-gray-900 mb-2">
                A Little Reminder
              </h3>

              <p className="text-sm text-gray-500 leading-relaxed">
                Every plant is unique. Always check the specific
                care requirements of your plant, as watering,
                sunlight, and temperature needs may vary.
              </p>
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center bg-[#2B7A4B] text-white px-7 py-3 rounded-lg text-sm hover:bg-[#23663E] transition"
              >
                Explore More Plants
              </Link>
            </div>

          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          © Leafly — Bring Nature Home
        </p>

      </div>
    </div>

  )
}

export default PlantCareGuidePage
