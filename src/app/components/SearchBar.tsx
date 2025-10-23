"use client";

import React, { useState, useRef, useEffect } from "react";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
}

export default function SearchBar({ placeholder = "Search node", onSearch }: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch?.(value);
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
      {/* Десктопная версия - старый инпут */}
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
          onChange={handleChange}
          className="block bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent w-[370px] py-[13px] pl-[46px] pr-5 border border-[#1B1C1F] rounded-full font-[Poppins] font-normal text-[13px] text-[#797979]"
        />
      </div>

      {/* Мобильная версия - выдвигающийся инпут */}
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
            className={`block bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 ease-in-out h-[41px] ${
              isExpanded ? "w-full pl-[46px] pr-5" : "w-[55px] pl-[46px] pr-0"
            } border border-[#1B1C1F] rounded-full font-[Poppins] font-normal text-[13px] text-[#797979]`}
          />
        </div>
      </div>
    </>
  );
}
