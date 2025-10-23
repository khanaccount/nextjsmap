"use client";

import React, { useState, useCallback, useEffect } from "react";
import { HiUser } from "react-icons/hi";

interface NodeData {
  id: string;
  name: string;
  as: string;
  country: string;
  countryCode: string;
  ip: string;
  percentage: number;
  count: number;
}

interface NodeCentersModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: NodeData[];
}

const NodeCentersModal: React.FC<NodeCentersModalProps> = ({ isOpen, onClose, nodes }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleClose = useCallback(() => {
    onClose();
    setCurrentPage(1);
  }, [onClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const totalPages = Math.ceil(nodes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNodes = nodes.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="absolute inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm" />

      <div className="relative mx-4 bg-[#0F0F0F] rounded-[20px] shadow-2xl max-lg:w-full max-lg:max-w-[390px] max-lg:h-auto max-lg:min-h-[400px] w-[897px] h-[278px]">
        <div className="flex items-center justify-between px-[30px] pt-[30px] pb-[26px] max-lg:px-[15px] max-lg:pt-[20px] max-lg:pb-[20px]">
          <h2
            id="modal-title"
            className="text-white max-lg:text-[15px] max-lg:font-medium font-[Poppins] text-[20px] font-medium"
          >
            Node Data centers
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-[#181818]"
            aria-label="Закрыть модальное окно"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-[30px] pb-[30px] flex flex-col max-lg:px-[15px] max-lg:pb-[20px] h-[calc(100%-76px)]">
          {nodes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Нет данных о нодах</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-x-4 flex-1 mb-[40px] max-lg:grid-cols-1 max-lg:gap-y-4 max-lg:justify-items-center gap-[16px_20px]">
                {currentNodes.map((node, index) => (
                  <div
                    key={node.id}
                    className="flex items-center max-lg:w-full max-lg:h-auto w-[263px] h-[23px]"
                  >
                    <span className="font-[PingFang_HK] font-normal text-[16px] text-[#7C8798]">
                      {startIndex + index + 1}
                    </span>

                    <div className="w-[15px]" />

                    <div className="w-[18px] h-[18px] flex items-center justify-center">
                      <HiUser size={18} color="#7C8798" />
                    </div>

                    <div className="w-[7px]" />

                    <span
                      className="flex-1 max-lg:mr-[72px] font-[Poppins] font-normal text-[15px] text-white max-w-[200px] mr-[40px]"
                      title={node.name}
                    >
                      {node.name}
                    </span>

                    <div className="px-[20px] w-[66px] h-[23px] bg-[rgba(154,177,207,0.16)] rounded-[1000px] flex items-center justify-center">
                      <span className="font-[Poppins] font-normal text-[15px] text-[#7C8798]">
                        {node.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center space-x-2 mt-auto">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  aria-label="В начало"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  aria-label="Предыдущая страница"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <div className="flex items-center space-x-1">
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageClick(page)}
                      className={`px-3 py-1 rounded transition-colors duration-200 font-[Poppins] font-normal text-[15px] ${
                        page === currentPage
                          ? "bg-[#3B82F6] text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                      aria-label={`Страница ${page}`}
                      aria-current={page === currentPage ? "page" : undefined}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  aria-label="Следующая страница"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  aria-label="В конец"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NodeCentersModal;
