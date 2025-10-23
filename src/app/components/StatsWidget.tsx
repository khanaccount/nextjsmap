"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface StatsWidgetProps {
  onOpenModal: () => void;
}

const data = [
  { name: "Node center", value: 1, color: "#8B5CF6" },
  { name: "Node center", value: 1, color: "#F59E0B" },
  { name: "Node center", value: 1, color: "#10B981" },
  { name: "Node center", value: 1, color: "#3B82F6" },
  { name: "Node center", value: 1, color: "#059669" },
];

export default function StatsWidget({ onOpenModal }: StatsWidgetProps) {
  return (
    <div className="p-6 w-[346px] h-[282px] bg-[#0C0D0E] rounded-[20px] max-lg:w-full max-lg:h-auto max-lg:p-[15px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-[Poppins] font-light text-lg">Node Data center</h2>
        <div className="flex items-center gap-2">
          {/* Горизонтальный ряд кружочков */}
          <div className="flex items-center">
            {data.map((item, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full "
                style={{
                  backgroundColor: item.color,
                  marginLeft: index > 0 ? "-14px" : "0",
                  zIndex: data.length + index,
                }}
              />
            ))}
          </div>
          <span className="text-2xl font-bold text-white">5</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6 max-lg:flex-col">
        <div className="shrink-0">
          <div className="relative w-[138px] h-[138px] max-lg:w-[125px] max-lg:h-[125px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={57}
                  paddingAngle={0}
                  dataKey="value"
                  strokeWidth={0}
                  cornerRadius={3}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke={entry.color}
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grow">
          <div className="space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-white">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex justify-center">
        <button
          onClick={onOpenModal}
          className="text-white transition-all duration-300 hover:bg-white/25 w-[139px] h-7 flex items-center justify-center font-[Poppins] font-normal text-[13px] cursor-pointer bg-white/15 rounded-full"
        >
          View all centers
        </button>
      </div>
    </div>
  );
}
