"use client";

import React, { useState, useCallback } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { MAP_MARKERS } from "../utils/constants";
import { calculateMapCenter, filterGeographies } from "../utils/helpers";

interface MapComponentProps {
  zoom?: number;
  center?: [number, number];
  onCenterChange?: (newCenter: [number, number]) => void;
  onZoomChange?: (newZoom: number) => void;
}

export default function MapComponent({
  zoom = 1,
  center = [0, 20],
  onCenterChange,
  onZoomChange,
}: MapComponentProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

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

      const newCenter = calculateMapCenter(center, deltaX, deltaY, zoom);
      onCenterChange?.(newCenter);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    },
    [isDragging, lastMousePos, center, zoom, onCenterChange]
  );

  const handleGlobalMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

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
            center: center,
          }}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#000000",
            pointerEvents: "none",
          }}
        >
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

          {MAP_MARKERS.map((marker, index) => (
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
}
