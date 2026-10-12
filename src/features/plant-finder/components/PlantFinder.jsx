import React, { useEffect, useState } from 'react'
import WizardSection from './WizardSection'
import Button from '../../../components/Button'
import { LiaBrailleSolid } from 'react-icons/lia';

const PlantFinder = ({onResults}) => {

  const [roomLight, setRoomLight] = useState('Bright Direct sun or bright');
  const [hasPets, setHasPets] = useState(false);
  const [careCommitment, setCareCommitment] = useState('Low Minimal watering')
  const [desiredSize, setDesiredSize] = useState('Small Tabletop or shelf');
  const [stylePreference, setPreference] = useState('Modern');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const LightOptions = [
    'Bright Direct sun or bright',
    'Indirect Bright, filtered light',
    'Low Shades corners, low light'
  ]

  const petOptions = [
    {
      label: 'Yes Choose pet-safe plants', value: true
    },
    {
      label: 'No More variety available', value: false
    }
  ]

  const careOptions = [
    'Low Minimal watering',
    'Moderated Regular attention',
    'Enthusiast Detailed pruning &'
  ]

  const sizeOption = [
    'Small Tabletop or shelf',
    'Medium Floor plants under 4ft',
    'Large Statement trees'
  ]

  const styleOption = ['Modern', 'Bohemian', 'Minimalist']

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null)

      const payload = {
        room_light: roomLight,
        has_pets: hasPets,
        care_commitment: careCommitment,
        desired_size: desiredSize,
        style_preference: stylePreference || 'Any',
      }

      const res = await fetch('http://127.0.0.1:8000/api/plant-finder/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('📥 Status:', payload)


      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const matched = await res.json()
      


      if (onResults) onResults(matched)



    } catch (error) {
      console.error('Plant Finder failed:', error)
      setError(error.message)

    }
    finally {
      setLoading(false)
    }
  }

  const OptionButton = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm rounded-lg whitespace-nowrap transition-colors ${active
          ? 'bg-brand text-white'
          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
    >
      {children}
    </button>
  )

  useEffect(()=>{
    handleSubmit();
  },[])


  return (
    <div className="max-w-3xl mx-auto">

      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Plant Finder</h2>
          <p className="text-gray-500 text-sm">Tell us about your space and style — we'll recommend the perfect plants.</p>
        </div>
        <span className="text-xs text-gray-400 font-medium">Step 4 of 5</span>
      </div>


      <WizardSection
        number={1}
        title="Room Light"
        subtitle="What kind of light does the plant receive? This helps match plants by light tolerance."
        isCompleted={!!roomLight}
      >
        <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
          {LightOptions.map((opt)=>(
            <OptionButton key={opt} active={roomLight === opt} onClick={()=>setRoomLight(opt)}>
              {opt}
            </OptionButton>
          ))}
        </div>
        <div className="flex gap-4 items-center">
          <img
            src="https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=200&q=80"
            alt="Light example"
            className="w-24 h-16 rounded-lg object-cover"
          />

          <div className="text-xs">
            <p className="font-semibold text-gray-900 mb-1">Example</p>
            <p className="text-gray-500">Rooms with filtered windows suit plants that love indirect or bright indirect light.</p>
          </div>
        </div>
      </WizardSection>

      {/* Step 2: Presence of Pets */}
      <WizardSection
        number={2}
        title="Presence of Pets"
        subtitle="Do you have curious pets that might nibble on leaves? We'll prioritize non-toxic options."
        isCompleted={hasPets !== null}
      >
        <div className="flex gap-3 mb-4">
          {petOptions.map((opt)=>(
            <OptionButton key={String(opt.value)} active={hasPets === opt.value} onClick={()=> setHasPets(opt.value)}>
              {opt.label}
            </OptionButton>
          ))}
        </div>
        <div className="flex gap-4 items-center">
          <img
            src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=200&q=80"
            alt="Pet example"
            className="w-24 h-16 rounded-lg object-cover"
          />

          <div className="text-xs">
            <p className="font-semibold text-gray-900 mb-1">Safety note</p>
            <p className="text-gray-500">If you have pets, we'll remove plants that are known to be toxic to cats or dogs.</p>
          </div>
        </div>
      </WizardSection>

      <WizardSection
        number={3}
        title="Care Commitment"
        isCompleted={!!careCommitment}
        subtitle="How much time do you want to spend caring for your plant each week?"
      >
        <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
          
          {careOptions.map((opt)=>(
            <OptionButton key={opt} active={careCommitment === opt} onClick={()=>setCareCommitment(opt)}>
              {opt}

            </OptionButton>
          ))}
        </div>
        <div className="flex gap-4 items-center">
          <img
            src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=200&q=80"
            alt="Care example"
            className="w-24 h-16 rounded-lg object-cover"
          />

          <div className="text-xs">
            <p className="font-semibold text-gray-900 mb-1">Care tip</p>
            <p className="text-gray-500">Choose low for minimal maintenance varieties like ZZ plants or snake plants.</p>
          </div>
        </div>
      </WizardSection>

      {/* Step 4: Desired Size */}
      <WizardSection
        number={4}
        title="Desired Size"
        isCompleted={!!desiredSize}
        subtitle="Do you prefer small tabletop plants or large statement pieces?"
      >
        <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
          
          {sizeOption.map((opt)=>(
            <OptionButton key={opt} active={desiredSize === opt} onClick={()=>setDesiredSize(opt)}>
              {opt}
            </OptionButton>
          ))}
        </div>
        <div className="flex gap-4 items-center">
          <img
            src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=200&q=80"
            alt="Size example"
            className="w-24 h-16 rounded-lg object-cover"
          />

          <div className="text-xs">
            <p className="font-semibold text-gray-900 mb-1">Sizing guide</p>
            <p className="text-gray-500">Pick a size that fits your space and care preferences.</p>
          </div>
        </div>
      </WizardSection>

      <WizardSection
        number={5}
        title="Style Preferences"
        isCompleted={!!stylePreference}
        subtitle="Which interior style best matches your home?"
      >
        <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
          {styleOption.map((opt)=>(
            <OptionButton key={opt} active={stylePreference === opt} onClick={()=>setPreference(opt)}>
              {opt}
            </OptionButton>
          ))}
        </div>
        <div className="flex gap-4 items-center">
          <img
            src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=200&q=80"
            alt="Style example"
            className="w-24 h-16 rounded-lg object-cover"
          />
          <div className="text-xs">
            <p className="font-semibold text-gray-900 mb-1">Style tip</p>
            <p className="text-gray-500">Mix styles—plants can adapt to many decor approaches.</p>
          </div>
        </div>
      </WizardSection>

      {/* Footer Actions */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-400 max-w-xs">
          Use arrow keys to navigate. Enter to select. Screen-reader friendly labels included.
        </p>
        <div className="flex gap-3">
          {/* <Button text='Back' variant="secondary" />
          <Button variant="dark" text="Next" /> */}
          <Button onClick={handleSubmit} disabled={loading} text={loading ? 'Finding…' : 'Get results'} variant="primary" />
        </div>
      </div>
    </div>

  )
}

export default PlantFinder