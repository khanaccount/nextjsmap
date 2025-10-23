"use client";

import React from "react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { JP, US, DE } from "country-flag-icons/react/3x2";
import Image from "next/image";
import { IoCubeOutline } from "react-icons/io5";
import { LuCirclePower } from "react-icons/lu";

interface TableRow {
  id: number;
  rpc: string;
  flag: string;
  ip: string;
  nodeIcon: string;
  provider: string;
  blockNumber: string;
  isOn: boolean;
}

interface DataTableProps {
  data: TableRow[];
  onCopy: (text: string) => void;
  onPowerToggle: (rowId: number) => void;
  sortConfig: {
    blockHistory: "asc" | "desc" | null;
    indexation: "asc" | "desc" | null;
  };
  onSortByBlockHistory: (direction: "asc" | "desc") => void;
  onSortByIndexation: (direction: "asc" | "desc") => void;
  loading?: boolean;
}

export default function DataTable({
  data,
  onCopy,
  onPowerToggle,
  sortConfig,
  onSortByBlockHistory,
  onSortByIndexation,
  loading,
}: DataTableProps) {
  const handleBlockHistorySort = () => {
    if (sortConfig.blockHistory === "desc") {
      onSortByBlockHistory("asc");
    } else {
      onSortByBlockHistory("desc");
    }
  };

  const handleIndexationSort = () => {
    if (sortConfig.indexation === "desc") {
      onSortByIndexation("asc");
    } else {
      onSortByIndexation("desc");
    }
  };

  const getSortIcon = (type: "blockHistory" | "indexation") => {
    const direction = sortConfig[type];
    if (direction === "asc") return <HiChevronUp size={15} color="#D4D4D4" />;
    if (direction === "desc") return <HiChevronDown size={15} color="#D4D4D4" />;
    return <HiChevronDown size={15} color="#D4D4D4" />;
  };

  if (loading) {
    return (
      <div className="h-[389px] border border-[#1B1C1F] rounded-[20px] pt-[10px] px-5 bg-transparent overflow-hidden max-lg:border-0 max-lg:rounded-none max-lg:px-0">
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-400">Загрузка данных...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[389px] border border-[#1B1C1F] rounded-[20px] pt-[10px] px-5 bg-transparent overflow-hidden max-lg:border-0 max-lg:rounded-none max-lg:px-0">
      <div className="w-[1433px] h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-[#4B4B4B] scrollbar-track-[#1B1C1F]">
        <div className="w-full h-[46px] flex items-center border-b border-[#1B1C1F] bg-black sticky top-0 z-10 max-lg:hidden">
          <div className="w-[394px] pl-[20px]">
            <span className="font-[Poppins] text-[13px] text-[#D4D4D4] font-normal">
              Status, Location
            </span>
          </div>
          <div className="w-[368px] pl-[105px]">
            <span className="font-[Poppins] text-[13px] text-[#D4D4D4] font-normal">Node</span>
          </div>
          <div className="w-[368px] pl-[20px]">
            <button
              onClick={handleBlockHistorySort}
              className="flex items-center cursor-pointer hover:text-white transition-colors"
            >
              <span className="font-[Poppins] text-[13px] text-[#D4D4D4] font-normal">
                Block history
              </span>
              <div className="ml-[8px]">{getSortIcon("blockHistory")}</div>
            </button>
          </div>
          <div className="flex-1 pl-[20px]">
            <button
              onClick={handleIndexationSort}
              className="flex items-center cursor-pointer hover:text-white transition-colors"
            >
              <span className="font-[Poppins] text-[13px] text-[#D4D4D4] font-normal">
                Indexation
              </span>
              <div className="ml-[8px]">{getSortIcon("indexation")}</div>
            </button>
          </div>
        </div>

        {data.map((row) => {
          const FlagComponent = row.flag === "JP" ? JP : row.flag === "US" ? US : DE;

          return (
            <React.Fragment key={`row-${row.id}`}>
              {/* Десктопная версия */}
              <div className="h-[83px] flex items-center bg-transparent border-b border-[#1B1C1F] hidden lg:flex">
                <div className="w-[394px] pl-[20px] flex items-center gap-[30px]">
                  <span className="font-[Poppins] font-normal text-[15px] text-[#DADADA]">
                    {row.rpc}
                  </span>
                  <FlagComponent title={row.flag} className="w-[16px] h-[12px]" />
                  <span className="font-[Poppins] font-normal text-[15px] text-[#DADADA]">
                    {row.ip}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#797979"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="cursor-pointer"
                    onClick={() => onCopy(row.ip)}
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </div>

                <div className="w-[368px] pl-[40px] flex items-center gap-[5px]">
                  <Image src={row.nodeIcon} alt="Node" width={20} height={20} />
                  <span className="font-[Poppins] font-normal text-[15px] text-[#DADADA]">
                    {row.provider}
                  </span>
                </div>

                <div className="w-[259px] pl-[20px] flex items-center gap-[5px]">
                  <IoCubeOutline size={16} color="#3180FF" />
                  <span className="font-[Poppins] font-normal text-[15px] text-[#3180FF]">
                    {row.blockNumber}
                  </span>
                </div>

                <div
                  className="flex-1 flex items-center justify-center gap-[10px] cursor-pointer"
                  onClick={() => onPowerToggle(row.id)}
                >
                  <LuCirclePower size={28} color={row.isOn ? "#69E7A8" : "#4B4B4B"} />
                  <span className="font-[Poppins] font-normal text-[15px] text-[#DADADA]">
                    {row.isOn ? "On" : "Off"}
                  </span>
                </div>
              </div>

              {/* Мобильная версия */}
              <div className="py-[10px] lg:hidden">
                <div className="flex items-center pb-[20px]">
                  <span className="text-[#DADADA] font-[Poppins] text-[15px] font-normal mr-[15px]">
                    {row.rpc}
                  </span>
                  <FlagComponent title={row.flag} className="w-[16px] h-[12px] mr-[10px]" />
                  <span className="text-[#DADADA] font-[Poppins] text-[15px] font-normal mr-[15px]">
                    {row.ip}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#797979"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="cursor-pointer"
                    onClick={() => onCopy(row.ip)}
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </div>

                <div className="flex flex-col items-start pb-[15px]">
                  <span className="text-[#DADADA] font-[Poppins] text-[15px] font-normal mb-[5px]">
                    Node
                  </span>
                  <div className="flex items-center">
                    <Image
                      src={row.nodeIcon}
                      alt="Node"
                      width={20}
                      height={20}
                      className="mr-[5px]"
                    />
                    <span className="text-[#DADADA] font-[Poppins] text-[15px] font-normal">
                      {row.provider}
                    </span>
                  </div>
                </div>

                <div className="flex gap-5 items-start pb-[15px] border-b border-[#1B1C1F]">
                  <div className="flex flex-col items-start">
                    <span className="text-[#DADADA] font-[Poppins] text-[15px] font-normal mb-[10px]">
                      Block history
                    </span>
                    <div className="flex items-center">
                      <IoCubeOutline size={16} color="#3180FF" className="mr-[5px]" />
                      <span className="text-[#3180FF] font-[Poppins] text-[15px] font-normal">
                        {row.blockNumber}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-start">
                    <span className="text-[#DADADA] font-[Poppins] text-[15px] font-normal mb-[10px]">
                      Indexation
                    </span>
                    <button
                      className="flex items-center gap-[10px] cursor-pointer"
                      onClick={() => onPowerToggle(row.id)}
                    >
                      <LuCirclePower size={28} color={row.isOn ? "#69E7A8" : "#4B4B4B"} />
                      <span className="text-[#DADADA] font-[Poppins] text-[15px] font-normal">
                        {row.isOn ? "On" : "Off"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
