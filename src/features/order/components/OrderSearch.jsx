import { ChevronRight, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import useCookie from 'react-use-cookie'
import OrderSearchResult from './OrderSearchResult';

const OrderSearch = () => {
    const [showresult, setShowResult] = useState(false);
    const [results, setResults] = useState([]);

    // useEffect(() => {

    // }, [results])

    const [token] = useCookie("token");
    const handleSearch = async (q) => {
        if(q.length != 0)
        {
            setShowResult(true)
        const res = await fetch(`http://127.0.0.1:8000/api/orders/search?q=${q}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        const data = await res.json();
        setResults(data)
        }
        else
        {
            setResults([]);
            setShowResult(false)
        }


    }

    



    return (
        <div className=''>
            <div className="relative w-full lg:max-w-lg md:w-[430px]">
                <Search
                    size={18}

                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                    type="text"
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search orders or plants..."
                    className="w-full rounded-xl border border-gray-200 bg-[#FCFBF9] py-3 pl-10 pr-4 text-sm outline-none placeholder:text-gray-400 focus:border-[#2B7A4B] focus:ring-2 focus:ring-[#2B7A4B]/10"
                />
            </div>
            {
                showresult && (
                    <div className="mt-2 pt-5 space-y-4 absolute rounded-xl border border-gray-200 bg-[#FFFDF9]">
                        <div className="flex px-4 items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-800">
                                Search Results
                            </h3>
                            <span className="text-sm text-gray-400">{results.length} results</span>

                        </div>

                        <div className="divide-y divide-gray-100 ">
                            <hr className='mx-4' />
                            {
                                results && results.map((result) => (
                                   <OrderSearchResult result={result}/>
                                ))
                            }
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default OrderSearch