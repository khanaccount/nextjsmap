export interface MapDataItem {
  noder: {
    moniker: string;
    address: string;
  };
  country: string;
  city: string;
  lat: number;
  lon: number;
  isp: string;
  as: string;
  ip: string;
  [key: string]: unknown;
}

export interface NetworkDataItem {
  noder: {
    moniker: string;
    address: string;
  };
  rpcIp?: string;
  grpcIp?: string;
  apiIp?: string;
  evmIp?: string;
  uptime: string;
  tx_index: "on" | "off";
  [key: string]: unknown;
}

export interface ProcessedNodeData {
  id: string;
  name: string;
  as: string;
  country: string;
  countryCode: string;
  ip: string;
  percentage: number;
  count: number;
}

export interface ProcessedNetworkData {
  id: number;
  rpc: string;
  flag: string;
  ip: string;
  nodeIcon: string;
  provider: string;
  blockNumber: string;
  isOn: boolean;
  type: "RPC" | "Peers";
}

export const CHART_COLORS = ["#8B5CF6", "#F59E0B", "#10B981", "#3B82F6", "#059669", "#EF4444"];

export const processMapData = (data: MapDataItem[]): ProcessedNodeData[] => {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }

  const groupedByAs = data.reduce((acc, item) => {
    const as = item.as || "Unknown";
    if (!acc[as]) {
      acc[as] = [];
    }
    acc[as].push(item);
    return acc;
  }, {} as Record<string, MapDataItem[]>);

  const sortedGroups = Object.entries(groupedByAs)
    .sort(([, a], [, b]) => b.length - a.length)
    .slice(0, 6);

  const totalNodes = data.length;

  return sortedGroups.map(([as, items], index) => {
    const firstItem = items[0];
    const count = items.length;
    const percentage = (count / totalNodes) * 100;

    const getCountryCode = (country: string): string => {
      const countryMap: Record<string, string> = {
        Finland: "FI",
        Germany: "DE",
        Singapore: "SG",
        "United States": "US",
      };
      return countryMap[country] || "XX";
    };

    return {
      id: `node-${index + 1}`,
      name: firstItem.isp || `Node Center ${index + 1}`,
      as,
      country: firstItem.country || "Unknown",
      countryCode: getCountryCode(firstItem.country),
      ip: firstItem.ip || "Unknown",
      percentage: Math.round(percentage * 100) / 100,
      count,
    };
  });
};

export const processNetworkData = (
  data: NetworkDataItem[],
  type: "RPC" | "Peers" = "RPC",
  mapData?: Array<{ ip: string; country: string; lat: number; lon: number }>
): ProcessedNetworkData[] => {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }

  return data.map((item, index) => {
    const getStatus = (item: NetworkDataItem): string => {
      const statuses = [];
      if (item.rpcIp) statuses.push("RPC");
      if (item.grpcIp) statuses.push("GRPC");
      if (item.apiIp) statuses.push("REST");
      if (item.evmIp) statuses.push("EVM RPC");
      return statuses.join(", ") || "Unknown";
    };

    const getLocation = (item: NetworkDataItem): string => {
      const locations = [];
      if (item.rpcIp) locations.push(item.rpcIp);
      if (item.grpcIp) locations.push(item.grpcIp);
      if (item.apiIp) locations.push(item.apiIp);
      if (item.evmIp) locations.push(item.evmIp);
      return locations.join(", ") || "Unknown";
    };

    const mainIp = item.rpcIp || item.grpcIp || item.apiIp || item.evmIp || "Unknown";

    const getCountryFlag = (ip: string): string => {
      // Сначала пытаемся найти совпадение в map-data
      if (mapData && mapData.length > 0) {
        const ipWithoutPort = ip.split(":")[0];
        const matchingNode = mapData.find((node) => node.ip === ipWithoutPort);
        if (matchingNode) {
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
          return countryMap[matchingNode.country] || "XX";
        }
      }

      // Fallback к старой логике
      if (ip.includes("192.168") || ip.includes("10.0") || ip.includes("172.16")) {
        return "US";
      }
      if (ip.includes("84.247")) return "DE";
      if (ip.includes("203.0")) return "DE";
      if (ip.includes("198.51")) return "JP";
      if (ip.includes("51.15") || ip.includes("51.158")) return "FR";
      if (ip.includes("45.76")) return "SG";
      if (ip.includes("104.238")) return "US";
      if (ip.includes("144.202")) return "US";
      if (ip.includes("46.4")) return "DE";
      if (ip.includes("148.72")) return "US";
      if (ip.includes("46.166")) return "DE";
      return "US";
    };

    return {
      id: index + 1,
      rpc: getStatus(item),
      flag: getCountryFlag(mainIp),
      ip: getLocation(item),
      nodeIcon: "/nodeIcon.svg",
      provider: item.noder?.moniker || `Provider ${index + 1}`,
      blockNumber: item.uptime || "0",
      isOn: item.tx_index === "on",
      type,
    };
  });
};

export const filterNetworkDataByMoniker = (
  data: ProcessedNetworkData[],
  searchTerm: string
): ProcessedNetworkData[] => {
  if (!searchTerm.trim()) {
    return data;
  }

  return data.filter((item) => item.provider.toLowerCase().includes(searchTerm.toLowerCase()));
};

export const sortByBlockHistory = (
  data: ProcessedNetworkData[],
  direction: "asc" | "desc" = "desc"
): ProcessedNetworkData[] => {
  return [...data].sort((a, b) => {
    const aValue = parseInt(a.blockNumber.replace(/\s/g, "")) || 0;
    const bValue = parseInt(b.blockNumber.replace(/\s/g, "")) || 0;

    return direction === "asc" ? aValue - bValue : bValue - aValue;
  });
};

export const sortByIndexation = (
  data: ProcessedNetworkData[],
  direction: "asc" | "desc" = "desc"
): ProcessedNetworkData[] => {
  return [...data].sort((a, b) => {
    const aValue = a.isOn ? 1 : 0;
    const bValue = b.isOn ? 1 : 0;

    return direction === "asc" ? aValue - bValue : bValue - aValue;
  });
};
