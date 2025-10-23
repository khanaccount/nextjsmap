import axios from "axios";

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

export interface NetworkApiResponse {
  rpcs: {
    cosmos: NetworkDataItem[];
    evm: NetworkDataItem[];
  };
  peers: {
    cosmos: NetworkDataItem[];
    evm: NetworkDataItem[];
  };
}

const apiClient = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchMapData = async (): Promise<MapDataItem[]> => {
  try {
    const response = await apiClient.get("/api/map-data-alt");
    return Array.isArray(response.data) ? response.data : [];
  } catch {
    try {
      const response = await apiClient.get("/api/map-data");
      return Array.isArray(response.data) ? response.data : [];
    } catch {
      throw new Error("Failed to fetch map data");
    }
  }
};

export const fetchNetworkData = async (): Promise<{
  rpcs: NetworkDataItem[];
  peers: NetworkDataItem[];
}> => {
  try {
    const response = await apiClient.get<NetworkApiResponse>("/api/network-data");
    const data = response.data;

    const rpcNodes: NetworkDataItem[] = [];
    const peerNodes: NetworkDataItem[] = [];

    if (data.rpcs?.cosmos) {
      rpcNodes.push(...data.rpcs.cosmos);
    }
    if (data.rpcs?.evm) {
      rpcNodes.push(...data.rpcs.evm);
    }
    if (data.peers?.cosmos) {
      peerNodes.push(...data.peers.cosmos);
    }
    if (data.peers?.evm) {
      peerNodes.push(...data.peers.evm);
    }

    return { rpcs: rpcNodes, peers: peerNodes };
  } catch {
    throw new Error("Failed to fetch network data");
  }
};
