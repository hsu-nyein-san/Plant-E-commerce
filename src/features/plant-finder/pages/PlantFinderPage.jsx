
import React, { useEffect, useState } from 'react'
import Container from '../../../components/Container'
import PlantFinder from '../components/PlantFinder'
import CuratedMatches from '../components/CuratedMatches'
import SelectedPlantPreviewSection from '../components/SelectedPlantPreviewSection'
import HelpAccessibility from '../components/HelpAccessibility'

const PlantFinderPage = () => {
  const [results, setResults] = useState(null)
  const [selected,setSelected] = useState([])




  useEffect(()=>{
    if(results && results.length > 0)
    {
      setSelected(results[0])
    }
  },[results])
  

  return (
    <Container>
      <div className="grid grid-cols-1 lg:grid-cols-12 py-6 sm:py-8 lg:py-10 gap-8 lg:gap-10 xl:gap-12">

        <div className="col-span-1 lg:col-span-7 xl:col-span-8 min-w-0 flex flex-col gap-8 sm:gap-10">
          <PlantFinder onResults={setResults} />
          <CuratedMatches results={results} selected={selected} setSelected={setSelected}/>
        </div>

        <div className="col-span-1 lg:col-span-5 xl:col-span-4 min-w-0">
          <div className="lg:sticky lg:top-24 flex flex-col gap-5 sm:gap-6">
            <SelectedPlantPreviewSection selected={selected}/>
            <HelpAccessibility />
          </div>
        </div>

      </div>
    </Container>
  )
}

export default PlantFinderPage
