"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchNetworkData } from "../services/api";
import {
  processNetworkData,
  ProcessedNetworkData,
  filterNetworkDataByMoniker,
  sortByBlockHistory,
  sortByIndexation,
} from "../utils/dataProcessing";

interface UseNetworkDataReturn {
  data: ProcessedNetworkData[];
  filteredData: ProcessedNetworkData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeTab: "RPC" | "Peers";
  setActiveTab: (tab: "RPC" | "Peers") => void;
  sortConfig: {
    blockHistory: "asc" | "desc" | null;
    indexation: "asc" | "desc" | null;
  };
  sortByBlockHistory: (direction: "asc" | "desc") => void;
  sortByIndexation: (direction: "asc" | "desc") => void;
  clearSorting: () => void;
  togglePower: (rowId: number) => void;
  setMapData: (mapData: Array<{ ip: string; country: string; lat: number; lon: number }>) => void;
}

export const useNetworkData = (): UseNetworkDataReturn => {
  const [data, setData] = useState<ProcessedNetworkData[]>([]);
  const [filteredData, setFilteredData] = useState<ProcessedNetworkData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"RPC" | "Peers">("RPC");
  const [sortConfig, setSortConfig] = useState({
    blockHistory: null as "asc" | "desc" | null,
    indexation: null as "asc" | "desc" | null,
  });
  const [mapData, setMapDataState] = useState<
    Array<{ ip: string; country: string; lat: number; lon: number }>
  >([]);

  const fetchNetworkDataCallback = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { rpcs, peers } = await fetchNetworkData();

      if (rpcs.length > 0 || peers.length > 0) {
        const rpcData = processNetworkData(rpcs, "RPC", mapData);
        const peerData = processNetworkData(peers, "Peers", mapData);

        const allData = [
          ...rpcData.map((item, index) => ({ ...item, id: index + 1 })),
          ...peerData.map((item, index) => ({ ...item, id: rpcData.length + index + 1 })),
        ];

        setData(allData);
        setFilteredData(allData);
      } else {
        setData([]);
        setFilteredData([]);
      }
    } catch (err) {
      console.error("Error fetching network data:", err);
      setError(
        `Failed to fetch network data: ${err instanceof Error ? err.message : "Unknown error"}`
      );
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  }, [mapData]);

  const handleSortByBlockHistory = useCallback(
    (direction: "asc" | "desc") => {
      const sortedData = sortByBlockHistory(filteredData, direction);
      setFilteredData(sortedData);
      setSortConfig((prev) => ({
        ...prev,
        blockHistory: direction,
        indexation: null,
      }));
    },
    [filteredData]
  );

  const handleSortByIndexation = useCallback(
    (direction: "asc" | "desc") => {
      const sortedData = sortByIndexation(filteredData, direction);
      setFilteredData(sortedData);
      setSortConfig((prev) => ({
        ...prev,
        indexation: direction,
        blockHistory: null,
      }));
    },
    [filteredData]
  );

  const clearSorting = useCallback(() => {
    setSortConfig({ blockHistory: null, indexation: null });
    setFilteredData(data);
  }, [data]);

  const togglePower = useCallback(
    (rowId: number) => {
      setData((prevData) =>
        prevData.map((item) => (item.id === rowId ? { ...item, isOn: !item.isOn } : item))
      );

      setFilteredData((prevFilteredData) => {
        const updatedData = prevFilteredData.map((item) =>
          item.id === rowId ? { ...item, isOn: !item.isOn } : item
        );

        if (sortConfig.indexation) {
          return sortByIndexation(updatedData, sortConfig.indexation);
        }

        return updatedData;
      });
    },
    [sortConfig.indexation]
  );

  const setMapData = useCallback(
    (newMapData: Array<{ ip: string; country: string; lat: number; lon: number }>) => {
      setMapDataState(newMapData);
    },
    []
  );

  useEffect(() => {
    let filtered = data;

    if (activeTab === "RPC") {
      filtered = filtered.filter((item) => item.type === "RPC");
    } else if (activeTab === "Peers") {
      filtered = filtered.filter((item) => item.type === "Peers");
    }

    if (searchTerm.trim()) {
      filtered = filterNetworkDataByMoniker(filtered, searchTerm);
    }

    if (sortConfig.indexation) {
      filtered = sortByIndexation(filtered, sortConfig.indexation);
    } else if (sortConfig.blockHistory) {
      filtered = sortByBlockHistory(filtered, sortConfig.blockHistory);
    }

    setFilteredData(filtered);
  }, [searchTerm, data, activeTab, sortConfig]);

  useEffect(() => {
    fetchNetworkDataCallback();
  }, [fetchNetworkDataCallback]);

  return {
    data,
    filteredData,
    loading,
    error,
    refetch: fetchNetworkDataCallback,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    sortConfig,
    sortByBlockHistory: handleSortByBlockHistory,
    sortByIndexation: handleSortByIndexation,
    clearSorting,
    togglePower,
    setMapData,
  };
};
