
import { ArrowUpRight, Leaf, Search } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const PlantSearch = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [search, setSearch] = useState([]);

    const handleSearch = async (value) => {
        if (value.trim()) {
            setShowDropdown(true);

            try {
                const res = await fetch(
                    `http://127.0.0.1:8000/api/plant/search?keyword=${encodeURIComponent(value)}`
                );

                const data = await res.json();

                setSearch(data.plants || []);
            } catch (error) {
                console.error("Search failed:", error);
                setSearch([]);
            }
        } else {
            setSearch([]);
            setShowDropdown(false);
        }
    };

    return (
        <div className="relative w-full sm:w-[280px] md:w-[300px] lg:w-[340px]">

            <div className="relative w-full">
                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={17}
                />

                <input
                    type="text"
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => {
                        if (search.length > 0) setShowDropdown(true);
                    }}
                    placeholder="Search plants, e.g., Monstera"
                    className="w-full pl-9 pr-4 py-2.5 bg-[#f4f4f5] border border-transparent rounded-md text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#2B7A4B] focus:ring-1 focus:ring-[#2B7A4B] transition-all"
                />
            </div>

            {showDropdown && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 sm:mt-3 overflow-hidden rounded-lg border border-[#676765] bg-[#f4f4f5] p-2 shadow-[0_12px_40px_rgba(35,50,30,0.09)]">

                    <div className="flex items-center justify-between px-3 pb-2 pt-2">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#969B90]">
                            Suggested plants
                        </span>

                        <span className="text-[11px] text-[#B0B2AA]">
                            {search.length} results
                        </span>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto">

                        {search.length > 0 ? (
                            search.map((plant) => (
                                <Link
                                    key={plant.id}
                                    to={`/house-plants/${plant.id}`}
                                    onClick={() => setShowDropdown(false)}
                                >
                                    <div className="flex cursor-pointer items-center gap-3 rounded-xl p-2.5 transition hover:bg-[#F4F6F0]">

                                        <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#EDF1E8]">
                                            <img
                                                src={plant.image_url}
                                                alt={plant.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-[13px] font-medium text-[#30392F]">
                                                {plant.name}
                                            </p>

                                            <p className="mt-1 truncate text-[11px] text-[#93988D]">
                                                {plant.category}
                                            </p>
                                        </div>

                                        <ArrowUpRight
                                            size={15}
                                            className="shrink-0 text-[#A2AA9C]"
                                        />
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="px-3 py-5 text-center text-xs text-gray-500">
                                No plants found.
                            </p>
                        )}

                    </div>

                    <div className="mx-2 mt-1 flex items-center gap-2 border-t border-[#F0EEE7] px-1 pb-1 pt-3">
                        <Leaf size={13} className="text-[#668665]" />

                        <p className="text-[10px] tracking-wide text-[#999D92]">
                            A little more green for your space
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlantSearch;
