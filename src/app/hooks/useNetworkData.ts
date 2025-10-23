"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchNetworkData } from "../services/api";
import {
  processNetworkData,
  ProcessedNetworkData,
  filterNetworkDataByMoniker,
  sortByBlockHistory,
  sortByIndexation,
  NetworkDataItem,
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
}

const mockNetworkData: ProcessedNetworkData[] = [
  {
    id: 1,
    rpc: "RPC",
    flag: "JP",
    ip: "http://127.0.0.1:32657",
    nodeIcon: "/nodeIcon.svg",
    provider: "Hetzner Online GmbH",
    blockNumber: "8 345 677",
    isOn: true,
    type: "RPC",
  },
  {
    id: 2,
    rpc: "RPC",
    flag: "US",
    ip: "http://192.168.1.100:8080",
    nodeIcon: "/nodeIcon.svg",
    provider: "DigitalOcean LLC",
    blockNumber: "8 345 678",
    isOn: false,
    type: "RPC",
  },
  {
    id: 3,
    rpc: "RPC",
    flag: "DE",
    ip: "http://203.0.113.1:8545",
    nodeIcon: "/nodeIcon.svg",
    provider: "AWS Europe",
    blockNumber: "8 345 679",
    isOn: true,
    type: "RPC",
  },
  {
    id: 4,
    rpc: "RPC",
    flag: "JP",
    ip: "http://198.51.100.1:8545",
    nodeIcon: "/nodeIcon.svg",
    provider: "Linode LLC",
    blockNumber: "8 345 680",
    isOn: false,
    type: "RPC",
  },
  {
    id: 5,
    rpc: "Peers",
    flag: "JP",
    ip: "http://127.0.0.1:32656",
    nodeIcon: "/nodeIcon.svg",
    provider: "Hetzner Online GmbH",
    blockNumber: "8 345 681",
    isOn: true,
    type: "Peers",
  },
  {
    id: 6,
    rpc: "Peers",
    flag: "US",
    ip: "http://192.168.1.100:8081",
    nodeIcon: "/nodeIcon.svg",
    provider: "DigitalOcean LLC",
    blockNumber: "8 345 682",
    isOn: false,
    type: "Peers",
  },
  {
    id: 7,
    rpc: "RPC",
    flag: "US",
    ip: "http://10.0.0.1:8545",
    nodeIcon: "/nodeIcon.svg",
    provider: "Google Cloud",
    blockNumber: "8 345 681",
    isOn: true,
    type: "RPC",
  },
];

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

  const fetchNetworkDataCallback = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { rpcs, peers } = await fetchNetworkData();

      if (rpcs.length > 0 || peers.length > 0) {
        const rpcData = processNetworkData(rpcs, "RPC");
        const peerData = processNetworkData(peers, "Peers");

        // Создаем уникальные id для объединенных данных
        const allData = [
          ...rpcData.map((item, index) => ({ ...item, id: index + 1 })),
          ...peerData.map((item, index) => ({ ...item, id: rpcData.length + index + 1 })),
        ];

        setData(allData);
        setFilteredData(allData);
      } else {
        setData(mockNetworkData);
        setFilteredData(mockNetworkData);
        setError("Using demo data - no data received");
      }
    } catch (err) {
      setError("Failed to fetch network data");
      setData(mockNetworkData);
      setFilteredData(mockNetworkData);
    } finally {
      setLoading(false);
    }
  }, []);

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

      // Обновляем filteredData с учетом текущей сортировки
      setFilteredData((prevFilteredData) => {
        const updatedData = prevFilteredData.map((item) =>
          item.id === rowId ? { ...item, isOn: !item.isOn } : item
        );

        // Применяем текущую сортировку по indexation если она активна
        if (sortConfig.indexation) {
          return sortByIndexation(updatedData, sortConfig.indexation);
        }

        return updatedData;
      });
    },
    [sortConfig.indexation]
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

    // Применяем текущую сортировку если она активна
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
  };
};
