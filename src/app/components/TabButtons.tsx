"use client";

import React from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

interface TabButtonsProps {
  activeTab: "RPC" | "Peers";
  onTabChange: (tab: "RPC" | "Peers") => void;
  onCopyAll: () => void;
}

export default function TabButtons({ activeTab, onTabChange, onCopyAll }: TabButtonsProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-4 max-lg:gap-[10px]">
        <button
          onClick={() => onTabChange("RPC")}
          className={`transition-all duration-200 py-[10px] px-[30px] max-lg:py-[11px] max-lg:px-[30px] rounded-full border-none font-[Poppins] font-normal text-sm cursor-pointer ${
            activeTab === "RPC" ? "bg-[#F8F9FF] text-black" : "bg-[#161616] text-[#797979]"
          }`}
        >
          RPC
        </button>
        <button
          onClick={() => onTabChange("Peers")}
          className={`transition-all duration-200 py-[10px] px-[30px] max-lg:py-[11px] max-lg:px-[30px] rounded-full border-none font-[Poppins] font-normal text-sm cursor-pointer ${
            activeTab === "Peers" ? "bg-[#F8F9FF] text-black" : "bg-[#161616] text-[#797979]"
          }`}
        >
          Peers
        </button>
      </div>

      <div className="flex items-center gap-[7px]">
        {/* Кнопка Copy all - десктоп */}
        <button
          className="hidden lg:flex items-center gap-2 transition-all duration-200 hover:bg-[#2a2a2a] py-[10px] pl-[15px] pr-5 bg-[#161616] rounded-full border-none text-[#D4D4D4] font-[Poppins] font-normal text-sm cursor-pointer"
          onClick={onCopyAll}
        >
          Copy all
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#D4D4D4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>

        {/* Кнопка Copy all - мобилка (только иконка) */}
        <button
          className="lg:hidden flex items-center justify-center transition-all duration-200 hover:bg-[#2a2a2a] py-[10px] px-[15px] bg-[#161616] rounded-full border-none text-[#D4D4D4] cursor-pointer"
          onClick={onCopyAll}
        >
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#D4D4D4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>

        {/* Кнопка Cosmos - мобилка */}
        <button className="lg:hidden flex items-center gap-1 transition-all duration-200 hover:bg-[#2a2a2a] py-[10px] px-[15px] bg-[#1C202F] rounded-full border-none text-[#D4D4D4] cursor-pointer">
          <span className="text-sm font-[Poppins]">Cosmos</span>
          <div className="flex flex-col">
            <IoIosArrowUp size={12} />
            <IoIosArrowDown size={12} />
          </div>
        </button>
      </div>
    </div>
  );
}
