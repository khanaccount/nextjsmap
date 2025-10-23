export const MAP_MARKERS = [
  {
    coordinates: [37.6176, 55.7558],
    country: "Russia",
    countryCode: "RU",
    ip: "84.247.131.170",
  },
  {
    coordinates: [-74.006, 40.7128],
    country: "United States",
    countryCode: "US",
    ip: "192.168.1.1",
  },
  {
    coordinates: [13.405, 52.52],
    country: "Germany",
    countryCode: "DE",
    ip: "203.0.113.1",
  },
  {
    coordinates: [139.6503, 35.6762],
    country: "Japan",
    countryCode: "JP",
    ip: "198.51.100.1",
  },
  {
    coordinates: [-0.1278, 51.5074],
    country: "United Kingdom",
    countryCode: "GB",
    ip: "203.0.113.2",
  },
];

export const TABLE_DATA = [
  {
    id: 1,
    rpc: "RPC",
    flag: "JP",
    ip: "http://127.0.0.1:32657",
    nodeIcon: "/nodeIcon.svg",
    provider: "Hetzner Online GmbH",
    blockNumber: "8 345 677",
    isOn: true,
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
  },
  {
    id: 5,
    rpc: "RPC",
    flag: "US",
    ip: "http://10.0.0.1:8545",
    nodeIcon: "/nodeIcon.svg",
    provider: "Google Cloud",
    blockNumber: "8 345 681",
    isOn: true,
  },
  {
    id: 6,
    rpc: "RPC",
    flag: "DE",
    ip: "http://172.16.0.1:8545",
    nodeIcon: "/nodeIcon.svg",
    provider: "Azure Germany",
    blockNumber: "8 345 682",
    isOn: false,
  },
  {
    id: 7,
    rpc: "RPC",
    flag: "JP",
    ip: "http://192.0.2.1:8545",
    nodeIcon: "/nodeIcon.svg",
    provider: "NTT Communications",
    blockNumber: "8 345 683",
    isOn: true,
  },
];

export const ZOOM_LIMITS = {
  MIN: 0.5,
  MAX: 3,
  STEP: 0.3,
};

export const NOTIFICATION_TIMEOUT = 2000;
