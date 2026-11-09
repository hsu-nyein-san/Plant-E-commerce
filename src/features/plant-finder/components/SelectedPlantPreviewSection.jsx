
import React, { useState } from 'react';
import { Mail, Printer } from 'lucide-react';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const SelectedPlantPreview = ({ selected }) => {
  const contentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: 'My Plant Care Plan'
  })


  const [isBeginnerCare, setIsBeginnerCare] = useState(false);

  const handleEmail = () => {
    const subject = `${selected?.name} - Leafly Plant Care Guide`;

    const body = `
      Leafly - Plant Care Guide

      Plant: ${selected?.name}

      CARE SUMMARY
      Watering: ${selected?.water_frequency}
      Light: ${selected?.light_requirement}
      Maintenance: ${selected?.maintenance}
      Care Level: ${selected?.care_level}
      Pet Safety: ${selected?.is_pet_safe ? 'Pet Safe' : 'Not Pet Safe'}

      CARE INSTRUCTIONS
      ${selected?.care_instructions || 'No care instructions available.'}

      Bring Nature Home - Leafly
      `;

      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

  const tags = selected?.tags?.length
    ? selected.tags
    : [
      {
        label: selected?.is_pet_safe ? 'Pet Safe' : 'Not Pet Safe',
        color: selected?.is_pet_safe ? 'green' : 'red'
      },
      {
        label: selected?.maintenance,
        color: 'blue'
      }
    ];

  return (
    <div className="w-full min-w-0 bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm">

      <div className="mb-4">
        <h3 className="text-base sm:text-[17px] font-semibold text-gray-900">
          Your Selection Preview
        </h3>
        <p className="text-xs sm:text-[13px] text-gray-500 mt-1 leading-relaxed">
          A quick snapshot of how this plant will fit your space.
        </p>
      </div>
      <div className="flex flex-col xs:flex-row sm:flex-row items-start xs:items-center gap-3 sm:gap-4 bg-[#f9f9f9] border border-gray-100 rounded-lg p-3 mb-5">

        <div className="w-14 h-14 rounded-md overflow-hidden shrink-0 bg-gray-200">
          <img
            src={selected.image_url}
            alt="Plant selection preview"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[13px] sm:text-[14px] font-semibold text-gray-900">
            Preview: {tags?.map(tag => tag.label).join("+")}
          </span>
          <span className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            Plant: {selected?.name}
          </span>
        </div>
      </div>
      <div className="border border-gray-200 rounded-lg p-3 sm:p-4 mb-4">

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-4">

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              Care Plan Options
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Receive a care plan summary by email or print it.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-col gap-2 w-full sm:w-auto shrink-0">

            <button className="px-2 sm:px-4 py-2 sm:py-1.5 text-xs sm:text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-center whitespace-nowrap">
              Email care plan
            </button>

            <button className="px-2 sm:px-4 py-2 sm:py-1.5 text-xs sm:text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-center whitespace-nowrap">
              Print care plan
            </button>

          </div>
        </div>
        <div className="pt-3 border-t border-gray-100">

          <div className="flex items-center justify-between gap-3 mb-1">

            <span className="text-xs sm:text-[13px] font-medium text-gray-800">
              Beginner-friendly care
            </span>

            <button
              role="switch"
              aria-checked={isBeginnerCare}
              onClick={() => setIsBeginnerCare(!isBeginnerCare)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${isBeginnerCare ? 'bg-black' : 'bg-gray-300'
                }`}
            >
              <span className="sr-only">
                Toggle beginner friendly care
              </span>

              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isBeginnerCare ? 'translate-x-4' : 'translate-x-[-8px]'
                  }`}
              />
            </button>

          </div>

          <p className="text-xs text-gray-500 leading-relaxed">
            Toggle to simplify watering and light instructions for first-time plant parents.
          </p>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-3 sm:p-4">

        <h4 className="text-sm font-semibold text-gray-900 mb-2">
          Care Summary{' '}
          <span className="font-normal text-gray-500 text-xs">
            (keyboard accessible)
          </span>
        </h4>

        <div>
          <p className="text-xs text-gray-500 mb-4 leading-relaxed">
            Water: {isBeginnerCare
              ? "Water when the soil feels dry"
              : selected.water_frequency
            }
            {" • "}
            Light: {isBeginnerCare
              ? "Keep near a bright window"
              : selected.light_requirement
            }
            {" • "}
            Maintenance: {isBeginnerCare
              ? "Easy to care for"
              : selected.maintenance
            }
          </p>
        </div>

        <div className="flex items-center gap-3">

          <button onClick={handleEmail} className="flex flex-col items-center justify-center w-14 h-12 shrink-0 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Mail className="w-4 h-4 mb-1" strokeWidth={2} />
            <span className="text-[11px] font-medium">Email</span>
          </button>

          <button onClick={handlePrint} className="flex flex-col items-center justify-center w-14 h-12 shrink-0 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Printer className="w-4 h-4 mb-1" strokeWidth={2} />
            <span className="text-[11px] font-medium">Print</span>
          </button>

        </div>

        <div
          ref={contentRef}
          className="print-care-plan hidden print:block bg-[#FFFDF9] text-[#303B32] p-8 max-w-[800px] mx-auto"
        >
          <div className="flex items-center justify-between border-b border-[#DCE5DA] pb-5 mb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-[#2B7A4B]">
                Leafly<span className="text-[#A7B99F]">.</span>
              </h1>
              <p className="text-xs tracking-[0.25em] uppercase text-gray-500 mt-1">
                Bring Nature Home
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-[#52745B]">
                PLANT CARE GUIDE
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Your personal growing companion
              </p>
            </div>
          </div>

          <div className="flex gap-7 items-center mb-9">
            <div className="w-52 h-52 shrink-0 rounded-2xl overflow-hidden bg-[#F1F3EC]">
              <img
                src={selected?.image_url}
                alt={selected?.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#78917A] mb-2">
                Your Selected Plant
              </p>

              <h2 className="text-3xl font-bold text-[#2B4935] leading-tight">
                {selected?.name}
              </h2>

              <p className="text-sm leading-6 text-gray-600 mt-3">
                {selected?.description || 'A beautiful addition to your indoor garden.'}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="bg-[#EAF1E8] text-[#426C4A] text-xs font-medium px-3 py-1.5 rounded-full">
                  {selected?.care_level} Care
                </span>

                <span className="bg-[#F3EFE5] text-[#8A7047] text-xs font-medium px-3 py-1.5 rounded-full">
                  {selected?.size}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-9">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-7 rounded-full bg-[#6B9B70]" />
              <div>
                <h3 className="text-xl font-bold text-[#2B4935]">
                  Care Essentials
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Everything your plant needs to thrive
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#F1F5EF] rounded-xl p-4 border border-[#E3EBDD]">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#78917A]">
                  Watering
                </p>
                <p className="text-base font-semibold text-[#304B37] mt-2">
                  {selected?.water_frequency}
                </p>
              </div>

              <div className="bg-[#F1F5EF] rounded-xl p-4 border border-[#E3EBDD]">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#78917A]">
                  Light Requirement
                </p>
                <p className="text-base font-semibold text-[#304B37] mt-2">
                  {selected?.light_requirement}
                </p>
              </div>

              <div className="bg-[#F1F5EF] rounded-xl p-4 border border-[#E3EBDD]">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#78917A]">
                  Maintenance
                </p>
                <p className="text-base font-semibold text-[#304B37] mt-2">
                  {selected?.maintenance}
                </p>
              </div>

              <div className="bg-[#F1F5EF] rounded-xl p-4 border border-[#E3EBDD]">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#78917A]">
                  Pet Safety
                </p>
                <p className={`text-base font-semibold mt-2 ${selected?.is_pet_safe ? 'text-[#426C4A]' : 'text-[#A34D42]'
                  }`}>
                  {selected?.is_pet_safe ? 'Pet Safe' : 'Not Pet Safe'}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-7 rounded-full bg-[#C6A66B]" />
              <div>
                <h3 className="text-xl font-bold text-[#2B4935]">
                  Care Instructions
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Simple guidance for a healthier plant
                </p>
              </div>
            </div>

            <div className="bg-[#FAF7F0] border border-[#EEE6D6] rounded-xl p-5">
              <p className="text-sm text-[#59645A] leading-7 whitespace-pre-line">
                {selected?.care_instructions || 'Follow the care essentials above to keep your plant healthy.'}
              </p>
            </div>
          </div>

          <div className="border-t border-[#DCE5DA] pt-5 flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-[#2B7A4B]">
                Leafly.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Bring Nature Home
              </p>
            </div>

            <p className="text-xs text-gray-400 italic">
              Made with care for your little green world 🌿
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SelectedPlantPreview;
