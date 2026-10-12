import React, { useState } from 'react'
import Container from '../../../components/Container'
import BreadCrumb from '../../../components/BreadCrumb'
import SideFilters from '../components/SideFilters'
import IndoorPlants from '../components/IndoorPlants'

const ShopPage = () => {
    const [result,setResult] = useState(null);
    const [pagination,setPagination]=useState(null);
    const {page,setPage}=useState(1);
  return (
    <Container>
        <div className="py-10 grid grid-cols-9 gap-6">
            
            <div className="col-span-2">
                <SideFilters setResult={setResult} setPagination={setPagination} page={page} limit={6}/>
            </div>
            <div className="col-span-7">
                <BreadCrumb currentPageTitle="Shop"/>
                <IndoorPlants result={result} pagination={pagination} onPageChange={setPage} setResult={setResult} setPagination={setPagination}/>
            </div>
        </div>
    </Container>
  )
}

export default ShopPage