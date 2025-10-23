"use client";

import React from "react";

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const ZoomControls = React.memo(function ZoomControls({ onZoomIn, onZoomOut }: ZoomControlsProps) {
  return (
    <div className="flex flex-col gap-[19px] items-end justify-end">
      <button
        onClick={onZoomIn}
        className="w-[44.27px] h-[44.43px] bg-[#484848] border-none rounded-[9.32px] text-white text-xl font-bold cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-[#5a5a5a]"
      >
        +
      </button>
      <button
        onClick={onZoomOut}
        className="w-[44.27px] h-[44.43px] bg-[#484848] border-none rounded-[9.32px] text-white text-xl font-bold cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-[#5a5a5a]"
      >
        -
      </button>
    </div>
  );
});

export default ZoomControls;
