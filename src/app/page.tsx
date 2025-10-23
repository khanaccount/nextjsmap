"use client";

import React, { useState, useCallback } from "react";
import NodeCentersModal from "./components/NodeCentersModal";
import StatsWidget from "./components/StatsWidget";
import ZoomControls from "./components/ZoomControls";
import SearchBar from "./components/SearchBar";
import TabButtons from "./components/TabButtons";
import DataTable from "./components/DataTable";
import Notification from "./components/Notification";
import MapComponent from "./components/MapComponent";
import { useNodeData } from "./hooks/useNodeData";
import { useNetworkData } from "./hooks/useNetworkData";
import { ZOOM_LIMITS, NOTIFICATION_TIMEOUT } from "./utils/constants";
import { copyToClipboard, calculateZoom } from "./utils/helpers";

export default function Home() {
  const [zoom, setZoom] = useState(1.5);
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 20]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copyNotification, setCopyNotification] = useState<string | null>(null);

  const { nodes, loading: nodesLoading, error: nodesError, totalNodes } = useNodeData();
  const {
    filteredData: networkData,
    loading: networkLoading,
    error: networkError,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    sortConfig,
    sortByBlockHistory,
    sortByIndexation,
    togglePower,
  } = useNetworkData();

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => calculateZoom(prev, ZOOM_LIMITS.STEP, ZOOM_LIMITS));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => calculateZoom(prev, -ZOOM_LIMITS.STEP, ZOOM_LIMITS));
  }, []);

  const handleMapCenterChange = useCallback((newCenter: [number, number]) => {
    setMapCenter(newCenter);
  }, []);

  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleCopy = useCallback(async (text: string) => {
    const message = await copyToClipboard(text);
    setCopyNotification(message);
    setTimeout(() => setCopyNotification(null), NOTIFICATION_TIMEOUT);
  }, []);

  const handlePowerToggle = useCallback(
    (rowId: number) => {
      togglePower(rowId);
    },
    [togglePower]
  );

  const handleSearch = useCallback(
    (value: string) => {
      setSearchTerm(value);
    },
    [setSearchTerm]
  );

  const handleCopyAll = useCallback(() => {
    const allData = networkData.map((item) => item.ip).join("\n");
    handleCopy(allData);
  }, [networkData, handleCopy]);

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto mobile-container w-[1473px] pt-10 pb-10 px-[30px] max-lg:w-[390px] max-lg:pt-[30px] max-lg:pb-5 max-lg:px-0">
        <h1 className="text-white font-[Manrope] font-normal text-[22px] mb-10 max-lg:mb-5">
          Node Data center
        </h1>

        <div className="flex gap-[110px] relative max-lg:flex-col-reverse max-lg:gap-0">
          <StatsWidget
            onOpenModal={handleOpenModal}
            nodes={nodes}
            totalNodes={totalNodes}
            loading={nodesLoading}
          />

          <div className="w-[711px] h-[425px] max-lg:w-full max-lg:h-[264px] max-lg:mb-5 relative">
            <MapComponent
              zoom={zoom}
              center={mapCenter}
              onCenterChange={handleMapCenterChange}
              onZoomChange={handleZoomChange}
            />

            <div className="hidden max-lg:block absolute bottom-[27px] right-[27px]">
              <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
            </div>
          </div>

          <div className="absolute bottom-0 right-0 max-lg:hidden">
            <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
          </div>
        </div>

        <div className="mt-10 max-lg:mt-5" />

        <div className="flex items-center justify-between">
          <h2 className="text-white font-[Manrope] font-normal text-[22px]">Locations</h2>

          <SearchBar onSearch={handleSearch} value={searchTerm} loading={networkLoading} />
        </div>

        <div className="mt-10" />

        <TabButtons activeTab={activeTab} onTabChange={setActiveTab} onCopyAll={handleCopyAll} />

        <div className="mt-5" />

        <DataTable
          data={networkData}
          onCopy={handleCopy}
          onPowerToggle={handlePowerToggle}
          sortConfig={sortConfig}
          onSortByBlockHistory={sortByBlockHistory}
          onSortByIndexation={sortByIndexation}
          loading={networkLoading}
        />

        {/* Показываем ошибки если есть */}
        {(nodesError || networkError) && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">
              {nodesError && `Ошибка загрузки данных нод: ${nodesError}`}
              {networkError && `Ошибка загрузки сетевых данных: ${networkError}`}
            </p>
          </div>
        )}
      </div>

      <Notification message={copyNotification} />

      <NodeCentersModal isOpen={isModalOpen} onClose={handleCloseModal} nodes={nodes} />
    </div>
  );
}
