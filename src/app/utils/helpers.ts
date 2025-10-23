export const copyToClipboard = async (text: string): Promise<string> => {
  try {
    await navigator.clipboard.writeText(text);
    return `Скопировано: ${text}`;
  } catch (err) {
    console.error("Ошибка копирования:", err);
    return "Ошибка копирования";
  }
};

export const calculateZoom = (
  currentZoom: number,
  delta: number,
  limits: { MIN: number; MAX: number }
): number => {
  const newZoom = currentZoom + delta;
  return Math.max(limits.MIN, Math.min(limits.MAX, newZoom));
};

export const calculateMapCenter = (
  center: [number, number],
  deltaX: number,
  deltaY: number,
  zoom: number
): [number, number] => {
  const deltaLng = -deltaX / (50 * zoom);
  const deltaLat = -deltaY / (50 * zoom);
  return [center[0] + deltaLng, center[1] + deltaLat];
};

export const filterGeographies = (geo: {
  properties?: { NAME?: string; name?: string };
}): boolean => {
  const name = geo.properties?.NAME || geo.properties?.name || "";
  return !name.toLowerCase().includes("antarctica") && !name.toLowerCase().includes("antarctic");
};
