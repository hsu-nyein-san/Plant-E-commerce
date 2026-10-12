import React, { useState } from 'react'
import Container from '../../../components/Container'
import PlantFinder from '../components/PlantFinder'
import CuratedMatches from '../components/CuratedMatches'
import SelectedPlantPreviewSection from '../components/SelectedPlantPreviewSection'
import HelpAccessibility from '../components/HelpAccessibility'

const PlantFinderPage = () => {
  const [results, setResults] = useState(null)  

  return (
    <Container>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 py-6 md:py-10 gap-8 lg:gap-12">
        
        <div className="col-span-1 lg:col-span-7 xl:col-span-8 flex flex-col gap-10">
          <PlantFinder onResults={setResults}/>
          <CuratedMatches results={results}/>
        </div>

        
        <div className="col-span-1 lg:col-span-5 xl:col-span-4">
          <div className="lg:sticky lg:top-24 flex flex-col gap-6">
            <SelectedPlantPreviewSection />
            <HelpAccessibility />
          </div>
        </div>
        
      </div>
    </Container>
  )
}

export default PlantFinderPage