"use client";

import React, { useState, useRef, useCallback } from "react";
import type { DonationTrendItem, DonationTrendUnit } from "@/app/_types/donation";

interface TooltipState {
  x: number;
  y: number;
  item: DonationTrendItem;
}

interface TrendChartProps {
  data: DonationTrendItem[];
  unit: DonationTrendUnit;
}

function formatCoinLabel(value: number): string {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}만`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}천`;
  return String(value);
}

function formatCoinFull(value: number): string {
  return value.toLocaleString("ko-KR") + "코인";
}

function formatXLabel(period: string, unit: DonationTrendUnit): string {
  if (unit === "day") {
    // "2026-04-15" → "4/15"
    const parts = period.split("-");
    if (parts.length === 3) return `${parseInt(parts[1])}/${parseInt(parts[2])}`;
    return period;
  }
  if (unit === "week") {
    // "2026-W16" → "W16"
    return period.replace(/^\d{4}-/, "");
  }
  // month: "2026-04" → "4월"
  const parts = period.split("-");
  if (parts.length === 2) return `${parseInt(parts[1])}월`;
  return period;
}

export const TrendChart: React.FC<TrendChartProps> = ({ data, unit }) => {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const W = 800;
  const H = 240;
  const PAD_L = 64;
  const PAD_R = 16;
  const PAD_T = 16;
  const PAD_B = 44;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;

  const maxValue = Math.max(...data.map((d) => d.total_coin_amount), 1);
  const n = data.length;
  const slotW = n > 0 ? chartW / n : chartW;
  const barW = Math.max(2, slotW * 0.6);

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((r) => ({
    value: Math.round(maxValue * r),
    y: PAD_T + chartH * (1 - r),
  }));

  // X labels: show every N-th label to avoid crowding
  const maxLabels = 12;
  const step = Math.max(1, Math.ceil(n / maxLabels));

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<SVGRectElement>, item: DonationTrendItem) => {
      const svg = svgRef.current;
      if (!svg) return;
      const svgRect = svg.getBoundingClientRect();
      const target = e.currentTarget.getBoundingClientRect();
      // tooltip position relative to SVG container element
      const cx = target.left + target.width / 2 - svgRect.left;
      const top = target.top - svgRect.top;
      setTooltip({ x: (cx / svgRect.width) * W, y: (top / svgRect.height) * H, item });
    },
    [],
  );

  const handleMouseLeave = useCallback(() => setTooltip(null), []);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-text-secondary text-sm">
        데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="relative w-full select-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block" }}
      >
        {/* Y grid + labels */}
        {yTicks.map((tick, i) => (
          <g key={i}>
            <line
              x1={PAD_L}
              y1={tick.y}
              x2={W - PAD_R}
              y2={tick.y}
              stroke="currentColor"
              strokeOpacity={i === 0 ? "0.25" : "0.08"}
              strokeWidth="1"
            />
            <text
              x={PAD_L - 6}
              y={tick.y + 4}
              textAnchor="end"
              fontSize="11"
              fill="currentColor"
              fillOpacity="0.45"
            >
              {formatCoinLabel(tick.value)}
            </text>
          </g>
        ))}

        {/* Bars */}
        {data.map((item, i) => {
          const barH = Math.max(
            item.total_coin_amount > 0 ? 3 : 0,
            (item.total_coin_amount / maxValue) * chartH,
          );
          const x = PAD_L + i * slotW + (slotW - barW) / 2;
          const y = PAD_T + chartH - barH;

          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={barW}
              height={barH}
              rx="3"
              className="fill-accent opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
              onMouseEnter={(e) => handleMouseEnter(e, item)}
              onMouseLeave={handleMouseLeave}
            />
          );
        })}

        {/* X axis labels */}
        {data.map((item, i) => {
          if (i % step !== 0 && i !== data.length - 1) return null;
          const cx = PAD_L + i * slotW + slotW / 2;
          return (
            <text
              key={i}
              x={cx}
              y={H - PAD_B + 16}
              textAnchor="middle"
              fontSize="11"
              fill="currentColor"
              fillOpacity="0.5"
            >
              {formatXLabel(item.period, unit)}
            </text>
          );
        })}

        {/* Tooltip SVG group (shown above bar) */}
        {tooltip && (() => {
          const tx = Math.min(Math.max(tooltip.x, 80), W - 80);
          const ty = Math.max(tooltip.y - 56, PAD_T + 4);
          return (
            <g>
              <rect
                x={tx - 70}
                y={ty}
                width={140}
                height={48}
                rx="6"
                fill="var(--bg-tertiary, #1f2937)"
                stroke="currentColor"
                strokeOpacity="0.15"
                strokeWidth="1"
              />
              <text
                x={tx}
                y={ty + 16}
                textAnchor="middle"
                fontSize="11"
                fill="currentColor"
                fillOpacity="0.6"
              >
                {tooltip.item.period}
              </text>
              <text
                x={tx}
                y={ty + 32}
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                fill="currentColor"
              >
                {formatCoinFull(tooltip.item.total_coin_amount)} · {tooltip.item.donation_count}회
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
};
