
import React, { useState } from 'react'
import Container from '../../../components/Container'
import BreadCrumb from '../../../components/BreadCrumb'
import SideFilters from '../components/SideFilters'
import IndoorPlants from '../components/IndoorPlants'

const ShopPage = () => {
  const [result, setResult] = useState(null)
  const [pagination, setPagination] = useState(null)
  const [page, setPage] = useState(1)

  return (
    <Container>
      <div className="py-6 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-9 gap-6 lg:gap-8">

          <aside className="lg:col-span-2 min-w-0">
            <SideFilters
              setResult={setResult}
              setPagination={setPagination}
              page={page}
              limit={6}
            />
          </aside>

          <main className="lg:col-span-7 min-w-0">
            <BreadCrumb currentPageTitle="Shop" />

            <IndoorPlants
              result={result}
              pagination={pagination}
              onPageChange={setPage}
              setResult={setResult}
              setPagination={setPagination}
            />
          </main>

        </div>
      </div>
    </Container>
  )
}

export default ShopPage
