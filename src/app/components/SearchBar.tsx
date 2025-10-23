"use client";

import React, { useState, useRef, useEffect } from "react";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  value?: string;
  loading?: boolean;
}

const SearchBar = React.memo(function SearchBar({
  placeholder = "Search node",
  onSearch,
  value = "",
  loading = false,
}: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    onSearch?.(newValue);
  };

  const handleClick = () => {
    setIsExpanded(true);
  };

  const handleBlur = () => {
    if (!searchValue) {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  return (
    <>
      <div className="relative hidden lg:block">
        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-5">
          <svg className="h-5 w-5" fill="none" stroke="#797979" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleChange}
          disabled={loading}
          className={`block bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent w-[370px] py-[13px] pl-[46px] pr-5 border border-[#1B1C1F] rounded-full font-[Poppins] font-normal text-[13px] text-[#797979] ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-5">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <div className="relative flex justify-end lg:hidden">
        <div
          className={`relative transition-all duration-300 ease-in-out ${
            isExpanded ? "w-[230px]" : "w-[55px]"
          }`}
        >
          <div className="absolute inset-y-0 left-0 flex items-center justify-center pointer-events-none w-[55px]">
            <svg className="h-5 w-5" fill="none" stroke="#797979" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder={isExpanded ? placeholder : ""}
            value={searchValue}
            onChange={handleChange}
            onClick={handleClick}
            onBlur={handleBlur}
            disabled={loading}
            className={`block bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 ease-in-out h-[41px] ${
              isExpanded ? "w-full pl-[46px] pr-5" : "w-[55px] pl-[46px] pr-0"
            } border border-[#1B1C1F] rounded-full font-[Poppins] font-normal text-[13px] text-[#797979] ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
          {loading && isExpanded && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-5">
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
});

export default SearchBar;
