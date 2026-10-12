import React, { useState } from 'react';
import { Mail, Printer } from 'lucide-react';

const SelectedPlantPreview = () => {
  const [isBeginnerCare, setIsBeginnerCare] = useState(false);

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      
      {/* Header Section */}
      <div className="mb-4">
        <h3 className="text-[17px] font-semibold text-gray-900">Your Selection Preview</h3>
        <p className="text-[13px] text-gray-500 mt-1">
          A quick snapshot of how these plants will fit your space.
        </p>
      </div>

      {/* Plant Preview Card */}
      <div className="flex items-center gap-4 bg-[#f9f9f9] border border-gray-100 rounded-lg p-3 mb-5">
        <div className="w-14 h-14 rounded-md overflow-hidden shrink-0 bg-gray-200">
          <img 
            src="/api/placeholder/100/100" 
            alt="Plant selection preview" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-[14px] font-semibold text-gray-900">
            Preview: Low Light + Pet-friendly
          </span>
          <span className="text-[12px] text-gray-500 mt-0.5">
            Plants: Snake Plant, Pothos, ZZ Plant
          </span>
        </div>
      </div>

      {/* Care Plan Options Block */}
      <div className="border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h4 className="text-[14px] font-semibold text-gray-900 mb-1">Care Plan Options</h4>
            <p className="text-[12px] text-gray-500 leading-relaxed">
              Receive a care plan summary by email or print it.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-2 shrink-0">
            <button className="px-4 py-1.5 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-center">
              Email care plan
            </button>
            <button className="px-4 py-1.5 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-center">
              Print care plan
            </button>
          </div>
        </div>

        {/* Toggle Switch Section */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[13px] font-medium text-gray-800">
              Beginner-friendly care
            </span>
            
            {/* Custom Toggle Switch */}
            <button 
              role="switch"
              aria-checked={isBeginnerCare}
              onClick={() => setIsBeginnerCare(!isBeginnerCare)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                isBeginnerCare ? 'bg-black' : 'bg-gray-300'
              }`}
            >
              <span className="sr-only">Toggle beginner friendly care</span>
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isBeginnerCare ? 'translate-x-4' : 'translate-x-[-8px]'
                }`}
              />
            </button>
          </div>
          <p className="text-[12px] text-gray-500 leading-relaxed">
            Toggle to simplify watering and light instructions for first-time plant parents.
          </p>
        </div>
      </div>

      {/* Care Summary Block */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="text-[14px] font-semibold text-gray-900 mb-2">
          Care Summary <span className="font-normal text-gray-500">(keyboard accessible)</span>
        </h4>
        
        <p className="text-[12px] text-gray-500 mb-4">
          Water: Every 2–3 weeks • Light: Low to indirect • Maintenance: Wipe leaves monthly
        </p>
        
        {/* Bottom Action Buttons */}
        <div className="flex items-center gap-3">
          <button className="flex flex-col items-center justify-center w-14 h-12 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Mail className="w-4 h-4 mb-1" strokeWidth={2} />
            <span className="text-[11px] font-medium">Email</span>
          </button>
          
          <button className="flex flex-col items-center justify-center w-14 h-12 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Printer className="w-4 h-4 mb-1" strokeWidth={2} />
            <span className="text-[11px] font-medium">Print</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default SelectedPlantPreview;