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
  mapMarkers: Array<{
    coordinates: [number, number];
    country: string;
    countryCode: string;
    ip: string;
    moniker: string;
  }>;
}

export const useNodeData = (): UseNodeDataReturn => {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalNodes, setTotalNodes] = useState(0);
  const [mapMarkers, setMapMarkers] = useState<
    Array<{
      coordinates: [number, number];
      country: string;
      countryCode: string;
      ip: string;
      moniker: string;
    }>
  >([]);

  const getCountryCode = (country: string): string => {
    const countryMap: Record<string, string> = {
      Finland: "FI",
      Germany: "DE",
      Singapore: "SG",
      "United States": "US",
      "United Kingdom": "GB",
      France: "FR",
      Russia: "RU",
      Japan: "JP",
    };
    return countryMap[country] || "XX";
  };

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

        // Создаем маркеры для карты
        const markers = rawData.map((item) => ({
          coordinates: [item.lon, item.lat] as [number, number],
          country: item.country,
          countryCode: getCountryCode(item.country),
          ip: item.ip,
          moniker: item.noder.moniker,
        }));
        setMapMarkers(markers);
      } else {
        setNodes([]);
        setTotalNodes(0);
        setMapMarkers([]);
      }
    } catch (err) {
      console.error("Error fetching node data:", err);
      setError(
        `Failed to fetch node data: ${err instanceof Error ? err.message : "Unknown error"}`
      );
      setNodes([]);
      setTotalNodes(0);
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
    mapMarkers,
  };
};
