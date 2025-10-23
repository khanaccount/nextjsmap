"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchMapData } from "../services/api";
import { processMapData, ProcessedNodeData, MapDataItem } from "../utils/dataProcessing";

export interface NodeData {
  id: string;
  name: string;
  as: string;
  country: string;
  countryCode: string;
  ip: string;
  percentage: number;
  count: number;
}

interface UseNodeDataReturn {
  nodes: NodeData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  totalNodes: number;
}

const mockNodeData: NodeData[] = [
  {
    id: "1",
    name: "Node Center Alpha",
    as: "AS12345",
    country: "United States",
    countryCode: "US",
    ip: "192.168.1.1",
    percentage: 25.5,
    count: 25,
  },
  {
    id: "2",
    name: "Node Center Beta",
    as: "AS67890",
    country: "Germany",
    countryCode: "DE",
    ip: "203.0.113.1",
    percentage: 20.3,
    count: 20,
  },
  {
    id: "3",
    name: "Node Center Gamma",
    as: "AS11111",
    country: "Japan",
    countryCode: "JP",
    ip: "198.51.100.1",
    percentage: 18.7,
    count: 18,
  },
  {
    id: "4",
    name: "Node Center Delta",
    as: "AS22222",
    country: "United Kingdom",
    countryCode: "GB",
    ip: "203.0.113.2",
    percentage: 15.2,
    count: 15,
  },
  {
    id: "5",
    name: "Node Center Epsilon",
    as: "AS33333",
    country: "Russia",
    countryCode: "RU",
    ip: "84.247.131.170",
    percentage: 12.8,
    count: 12,
  },
  {
    id: "6",
    name: "Node Center Zeta",
    as: "AS44444",
    country: "France",
    countryCode: "FR",
    ip: "203.0.113.3",
    percentage: 10.5,
    count: 10,
  },
];

export const useNodeData = (): UseNodeDataReturn => {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalNodes, setTotalNodes] = useState(0);

  const fetchNodeData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const rawData = await fetchMapData();

      if (rawData.length > 0) {
        const processedData = processMapData(rawData);
        const total = rawData.length;
        setTotalNodes(total);
        const sortedNodes = [...processedData].sort((a, b) => b.percentage - a.percentage);
        setNodes(sortedNodes);
      } else {
        setNodes(mockNodeData);
        setTotalNodes(100);
        setError("Using demo data - no data received");
      }
    } catch (err) {
      setError("Failed to fetch node data");
      setNodes(mockNodeData);
      setTotalNodes(100);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNodeData();
  }, [fetchNodeData]);

  return {
    nodes,
    loading,
    error,
    refetch: fetchNodeData,
    totalNodes,
  };
};
