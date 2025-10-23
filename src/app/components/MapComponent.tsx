"use client";

import React, { useState, useCallback, useRef } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { MAP_MARKERS } from "../utils/constants";
import { calculateMapCenter, filterGeographies } from "../utils/helpers";

interface MapComponentProps {
  zoom?: number;
  center?: [number, number];
  onCenterChange?: (newCenter: [number, number]) => void;
  onZoomChange?: (newZoom: number) => void;
  markers?: Array<{
    coordinates: [number, number];
    country: string;
    countryCode: string;
    ip: string;
    moniker: string;
  }>;
}

const MapMarkers = React.memo(
  ({
    markers,
  }: {
    markers?: Array<{
      coordinates: [number, number];
      country: string;
      countryCode: string;
      ip: string;
      moniker: string;
    }>;
  }) => {
    const displayMarkers = markers && markers.length > 0 ? markers : MAP_MARKERS;

    return (
      <>
        {displayMarkers.map((marker, index) => (
          <Marker key={index} coordinates={marker.coordinates as [number, number]}>
            <circle
              r={4}
              fill="#3B82F6"
              stroke="#ffffff"
              strokeWidth={1}
              style={{ pointerEvents: "none" }}
            />
          </Marker>
        ))}
      </>
    );
  }
);

MapMarkers.displayName = "MapMarkers";

const MapGeography = React.memo(() => {
  return (
    <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
      {({ geographies }) =>
        geographies.filter(filterGeographies).map((geo) => (
          <Geography
            key={geo.rsmKey}
            geography={geo}
            fill="#181818"
            stroke="#707070"
            strokeWidth={0.5}
            style={{
              default: {
                fill: "#181818",
                stroke: "#707070",
                strokeWidth: 0.5,
                outline: "none",
              },
              hover: {
                fill: "#2a2a2a",
                stroke: "#707070",
                strokeWidth: 0.5,
                outline: "none",
              },
              pressed: {
                fill: "#2a2a2a",
                stroke: "#707070",
                strokeWidth: 0.5,
                outline: "none",
              },
            }}
          />
        ))
      }
    </Geographies>
  );
});

MapGeography.displayName = "MapGeography";

const MapComponent = React.memo(function MapComponent({
  zoom = 1,
  center = [0, 20],
  onCenterChange,
  onZoomChange,
  markers,
}: MapComponentProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  const centerRef = useRef(center);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    centerRef.current = center;
  }, [center]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleGlobalMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;

      setPosition((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));

      const newCenter = calculateMapCenter(centerRef.current, deltaX, deltaY, zoom);
      centerRef.current = newCenter;
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      updateTimeoutRef.current = setTimeout(() => {
        onCenterChange?.(newCenter);
      }, 16);

      setLastMousePos({ x: e.clientX, y: e.clientY });
    },
    [isDragging, lastMousePos, zoom, onCenterChange]
  );

  const handleGlobalMouseUp = useCallback(() => {
    setIsDragging(false);
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
      onCenterChange?.(centerRef.current);
    }
  }, [onCenterChange]);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [isDragging, handleGlobalMouseMove, handleGlobalMouseUp]);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Math.max(0.5, Math.min(3, zoom + delta));
      if (newZoom !== zoom) {
        onZoomChange?.(newZoom);
      }
    },
    [zoom, onZoomChange]
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#000000",
        borderRadius: "8px",
        overflow: "hidden",
        cursor: isDragging ? "grabbing" : "grab",
        position: "relative",
      }}
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
    >
      <div
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          width: "100%",
          height: "100%",
          transition: isDragging ? "none" : "transform 0.2s ease",
          pointerEvents: "none",
          transformOrigin: "center center",
        }}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 100,
            center: centerRef.current,
          }}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#000000",
            pointerEvents: "none",
          }}
        >
          <MapGeography />
          <MapMarkers markers={markers} />
        </ComposableMap>
      </div>

      {isDragging && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "5px 10px",
            borderRadius: "4px",
            fontSize: "12px",
            zIndex: 1000,
          }}
        >
          Перетаскивание...
        </div>
      )}
    </div>
  );
});

export default MapComponent;
