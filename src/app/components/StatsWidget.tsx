"use client";

import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { CHART_COLORS } from "../utils/dataProcessing";

interface StatsWidgetProps {
  onOpenModal: () => void;
  nodes: Array<{
    id: string;
    name: string;
    as: string;
    country: string;
    countryCode: string;
    ip: string;
    percentage: number;
    count: number;
  }>;
  totalNodes: number;
  loading?: boolean;
}

export default function StatsWidget({ onOpenModal, nodes, totalNodes, loading }: StatsWidgetProps) {
  const chartData = useMemo(() => {
    return nodes.slice(0, 6).map((node, index) => ({
      name: node.name,
      value: node.percentage,
      color: CHART_COLORS[index % CHART_COLORS.length],
      count: node.count,
    }));
  }, [nodes]);

  // Если данных нет или идет загрузка, показываем заглушку
  if (loading) {
    return (
      <div className="p-6 w-[346px] h-[282px] bg-[#0C0D0E] rounded-[20px] max-lg:w-full max-lg:h-auto max-lg:p-[15px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-[Poppins] font-light text-lg">Node Data center</h2>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-600 rounded-full animate-pulse"></div>
            <span className="text-2xl font-bold text-white">...</span>
          </div>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-400">Загрузка данных...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-[365px] h-[302px] bg-[#0C0D0E] rounded-[20px] max-lg:w-full max-lg:h-auto max-lg:p-[15px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-[Poppins] font-light text-lg">Node Data center</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {chartData.slice(0, 5).map((item, index) => (
              <div
                key={`header-${item.name}-${index}`}
                className="w-6 h-6 rounded-full"
                style={{
                  backgroundColor: item.color,
                  marginLeft: index > 0 ? "-14px" : "0",
                  zIndex: chartData.length + index,
                }}
              />
            ))}
          </div>
          <span className="text-2xl font-bold text-white">{totalNodes}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6 max-lg:flex-col">
        <div className="shrink-0">
          <div className="relative w-[138px] h-[138px] max-lg:w-[125px] max-lg:h-[125px] min-w-[125px] min-h-[125px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={125} minHeight={125}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={57}
                  paddingAngle={0}
                  dataKey="value"
                  strokeWidth={0}
                  cornerRadius={3}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}-${index}`}
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
            {chartData.map((item, index) => (
              <div key={`node-${item.name}-${index}`} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-white truncate" title={item.name}>
                  {item.name}
                </span>
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
