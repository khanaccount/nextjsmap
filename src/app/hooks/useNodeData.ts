"use client";

import { useState, useEffect, useCallback } from "react";

// Типы для данных нод
export interface NodeData {
  id: string;
  name: string;
  as: string;
  country: string;
  countryCode: string;
  ip: string;
  percentage: number;
}

// Типы для состояния хука
interface UseNodeDataReturn {
  nodes: NodeData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Моковые данные для демонстрации
const mockNodeData: NodeData[] = [
  {
    id: "1",
    name: "Node Center Alpha",
    as: "AS12345",
    country: "United States",
    countryCode: "US",
    ip: "192.168.1.1",
    percentage: 25.5,
  },
  {
    id: "2",
    name: "Node Center Beta",
    as: "AS67890",
    country: "Germany",
    countryCode: "DE",
    ip: "203.0.113.1",
    percentage: 20.3,
  },
  {
    id: "3",
    name: "Node Center Gamma",
    as: "AS11111",
    country: "Japan",
    countryCode: "JP",
    ip: "198.51.100.1",
    percentage: 18.7,
  },
  {
    id: "4",
    name: "Node Center Delta",
    as: "AS22222",
    country: "United Kingdom",
    countryCode: "GB",
    ip: "203.0.113.2",
    percentage: 15.2,
  },
  {
    id: "5",
    name: "Node Center Epsilon",
    as: "AS33333",
    country: "Russia",
    countryCode: "RU",
    ip: "84.247.131.170",
    percentage: 12.8,
  },
  {
    id: "6",
    name: "Node Center Zeta",
    as: "AS44444",
    country: "France",
    countryCode: "FR",
    ip: "203.0.113.3",
    percentage: 10.5,
  },
  {
    id: "7",
    name: "Node Center Eta",
    as: "AS55555",
    country: "Canada",
    countryCode: "CA",
    ip: "198.51.100.2",
    percentage: 8.9,
  },
  {
    id: "8",
    name: "Node Center Theta",
    as: "AS66666",
    country: "Australia",
    countryCode: "AU",
    ip: "203.0.113.4",
    percentage: 7.3,
  },
  {
    id: "9",
    name: "Node Center Iota",
    as: "AS77777",
    country: "Brazil",
    countryCode: "BR",
    ip: "198.51.100.3",
    percentage: 5.8,
  },
  {
    id: "10",
    name: "Node Center Kappa",
    as: "AS88888",
    country: "India",
    countryCode: "IN",
    ip: "203.0.113.5",
    percentage: 4.2,
  },
  {
    id: "11",
    name: "Node Center Lambda",
    as: "AS99999",
    country: "South Korea",
    countryCode: "KR",
    ip: "198.51.100.4",
    percentage: 3.1,
  },
  {
    id: "12",
    name: "Node Center Mu",
    as: "AS10101",
    country: "Italy",
    countryCode: "IT",
    ip: "203.0.113.6",
    percentage: 2.7,
  },
];

// Хук для получения данных нод
export const useNodeData = (): UseNodeDataReturn => {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Функция для получения данных
  const fetchNodeData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Имитация API запроса
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // В реальном приложении здесь был бы запрос к API
      // const response = await fetch('/api/map-data');
      // const data = await response.json();

      // Сортируем по убыванию процента
      const sortedNodes = [...mockNodeData].sort((a, b) => b.percentage - a.percentage);

      setNodes(sortedNodes);
    } catch (err) {
      setError("Ошибка при загрузке данных нод");
      console.error("Error fetching node data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Загружаем данные при монтировании
  useEffect(() => {
    fetchNodeData();
  }, [fetchNodeData]);

  return {
    nodes,
    loading,
    error,
    refetch: fetchNodeData,
  };
};
