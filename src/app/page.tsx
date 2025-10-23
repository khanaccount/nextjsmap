"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
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

  const { nodes, loading: nodesLoading, error: nodesError, totalNodes, mapMarkers } = useNodeData();
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
    setMapData,
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

  // Передаем данные map-data в useNetworkData для сопоставления флагов
  useEffect(() => {
    if (mapMarkers.length > 0) {
      const mapData = mapMarkers.map((marker) => ({
        ip: marker.ip,
        country: marker.country,
        lat: marker.coordinates[1],
        lon: marker.coordinates[0],
      }));
      setMapData(mapData);
    }
  }, [mapMarkers, setMapData]);

  const mapProps = useMemo(
    () => ({
      zoom,
      center: mapCenter,
      onCenterChange: handleMapCenterChange,
      onZoomChange: handleZoomChange,
      markers: mapMarkers,
    }),
    [zoom, mapCenter, handleMapCenterChange, handleZoomChange, mapMarkers]
  );

  const statsWidgetProps = useMemo(
    () => ({
      onOpenModal: handleOpenModal,
      nodes,
      totalNodes,
      loading: nodesLoading,
    }),
    [handleOpenModal, nodes, totalNodes, nodesLoading]
  );

  const searchBarProps = useMemo(
    () => ({
      onSearch: handleSearch,
      value: searchTerm,
      loading: networkLoading,
    }),
    [handleSearch, searchTerm, networkLoading]
  );

  const tabButtonsProps = useMemo(
    () => ({
      activeTab,
      onTabChange: setActiveTab,
      onCopyAll: handleCopyAll,
    }),
    [activeTab, setActiveTab, handleCopyAll]
  );

  const dataTableProps = useMemo(
    () => ({
      data: networkData,
      onCopy: handleCopy,
      onPowerToggle: handlePowerToggle,
      sortConfig,
      onSortByBlockHistory: sortByBlockHistory,
      onSortByIndexation: sortByIndexation,
      loading: networkLoading,
    }),
    [
      networkData,
      handleCopy,
      handlePowerToggle,
      sortConfig,
      sortByBlockHistory,
      sortByIndexation,
      networkLoading,
    ]
  );

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto mobile-container w-[1473px] pt-10 pb-10 px-[30px] max-lg:w-[390px] max-lg:pt-[30px] max-lg:pb-5 max-lg:px-0">
        <h1 className="text-white font-[Manrope] font-normal text-[22px] mb-10 max-lg:mb-5">
          Node Data center
        </h1>

        <div className="flex gap-[110px] relative max-lg:flex-col-reverse max-lg:gap-0">
          <StatsWidget {...statsWidgetProps} />

          <div className="w-[711px] h-[425px] max-lg:w-full max-lg:h-[264px] max-lg:mb-5 relative">
            <MapComponent {...mapProps} />

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

          <SearchBar {...searchBarProps} />
        </div>

        <div className="mt-10" />

        <TabButtons {...tabButtonsProps} />

        <div className="mt-5" />

        <DataTable {...dataTableProps} />
      </div>

      <Notification message={copyNotification} />

      <NodeCentersModal isOpen={isModalOpen} onClose={handleCloseModal} nodes={nodes} />
    </div>
  );
}
