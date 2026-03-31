'use client';

import { useState } from "react";
import { WidgetRankingConfig, WidgetRankingStyle } from "@/app/_types/widget";

const rankingStyles: { id: WidgetRankingStyle; name: string; badge: string; description: string }[] = [
  {
    id: "list",
    name: "리스트형",
    badge: "기본형",
    description: "순위, 닉네임, 후원 금액을 번호 목록으로 깔끔하게 표시합니다.",
  },
  {
    id: "podium",
    name: "시상대형",
    badge: "강조형",
    description: "1~3위를 시상대로 부각하고 나머지는 목록으로 이어 보여줍니다.",
  },
];

const MOCK_RANKING = [
  { rank: 1, nickname: "도리토스", amount: 150000 },
  { rank: 2, nickname: "별빛고양이", amount: 95000 },
  { rank: 3, nickname: "감자별", amount: 72000 },
  { rank: 4, nickname: "루나", amount: 45000 },
  { rank: 5, nickname: "해바라기", amount: 30000 },
];

const RANK_COLORS = ["#fbbf24", "#94a3b8", "#fb923c"];
const RANK_LABELS = ["1위", "2위", "3위"];

function RankingPreview({ config }: { config: WidgetRankingConfig }) {
  const visible = MOCK_RANKING.slice(0, config.displayCount);

  if (config.style === "list") {
    return (
      <div className="absolute left-1/2 top-8 w-[300px] -translate-x-1/2 rounded-3xl border border-white/10 bg-black/60 p-5 backdrop-blur-sm">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#fbbf24]">
          Top Donors
        </div>
        <div className="mt-4 space-y-2">
          {visible.map((item) => (
            <div
              key={item.rank}
              className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2"
            >
              <span
                className="w-5 text-center text-sm font-bold"
                style={{ color: RANK_COLORS[item.rank - 1] ?? "rgba(255,255,255,0.4)" }}
              >
                {item.rank}
              </span>
              <span className="flex-1 text-sm text-white">{item.nickname}</span>
              <span className="text-sm font-semibold text-[#fbbf24]">
                {item.amount.toLocaleString()}원
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // podium
  const top3 = visible.slice(0, 3);
  const rest = visible.slice(3);
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);

  return (
    <div className="absolute left-1/2 top-6 w-[320px] -translate-x-1/2 rounded-3xl border border-white/10 bg-black/60 p-5 backdrop-blur-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#fbbf24]">
        Top Donors
      </div>
      {/* 시상대 */}
      <div className="mt-5 flex items-end justify-center gap-3">
        {podiumOrder.map((item) => {
          if (!item) return null;
          const isFirst = item.rank === 1;
          const color = RANK_COLORS[item.rank - 1];
          return (
            <div key={item.rank} className="flex flex-col items-center gap-1.5">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold"
                style={{ background: `${color}22`, border: `2px solid ${color}` }}
              >
                {item.rank === 1 ? "👑" : item.rank}
              </div>
              <span className="text-xs font-semibold text-white">{item.nickname}</span>
              <span className="text-[10px] text-white/60">{item.amount.toLocaleString()}원</span>
              <div
                className="flex w-full items-center justify-center rounded-t-lg text-[10px] font-bold text-white/80"
                style={{
                  background: `${color}33`,
                  height: isFirst ? 56 : item.rank === 2 ? 40 : 28,
                  minWidth: 72,
                }}
              >
                {RANK_LABELS[item.rank - 1]}
              </div>
            </div>
          );
        })}
      </div>
      {/* 4위 이하 */}
      {rest.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {rest.map((item) => (
            <div
              key={item.rank}
              className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-1.5"
            >
              <span className="w-4 text-center text-xs font-bold text-white/40">{item.rank}</span>
              <span className="flex-1 text-sm text-white">{item.nickname}</span>
              <span className="text-xs font-semibold text-[#fbbf24]">
                {item.amount.toLocaleString()}원
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const DEFAULT_CONFIG: WidgetRankingConfig = {
  style: "list",
  displayCount: 5,
};

export default function RankingWidget() {
  const [config, setConfig] = useState<WidgetRankingConfig>(DEFAULT_CONFIG);

  return (
    <div className="grid gap-6 xl:grid-cols-5">

      {/* 좌측 설정 패널 */}
      <div className="xl:col-span-2 space-y-3">

        {/* 스타일 선택 */}
        <div className="rounded-xl border border-border-primary bg-bg-secondary p-4">
          <p className="mb-3 text-xs font-semibold text-text-primary">스타일</p>
          <div className="space-y-2">
            {rankingStyles.map((option) => (
              <label
                key={option.id}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-all ${
                  config.style === option.id
                    ? "border-accent bg-background shadow-sm"
                    : "border-border-primary bg-background hover:border-accent/50"
                }`}
              >
                <input
                  type="radio"
                  name="ranking-widget-style"
                  checked={config.style === option.id}
                  onChange={() => setConfig((prev) => ({ ...prev, style: option.id }))}
                  className="h-3.5 w-3.5 flex-shrink-0"
                  style={{ accentColor: "var(--accent)" }}
                />
                <span className="text-sm font-medium text-text-primary">{option.name}</span>
                <span className="ml-auto rounded-full bg-bg-tertiary px-2 py-0.5 text-[10px] text-text-secondary">
                  {option.badge}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 세부 설정 */}
        <div className="rounded-xl border border-border-primary bg-bg-secondary p-4">
          <p className="mb-4 text-xs font-semibold text-text-primary">세부 설정</p>
          <div className="space-y-5">

            <div>
              <label className="flex items-center justify-between text-sm text-text-primary">
                <span>표시 인원</span>
                <span className="font-semibold text-accent">{config.displayCount}명</span>
              </label>
              <input
                type="range"
                min={3}
                max={10}
                step={1}
                value={config.displayCount}
                onChange={(e) => setConfig((prev) => ({ ...prev, displayCount: Number(e.target.value) }))}
                className="mt-2 w-full accent-[var(--accent)]"
              />
              <div className="mt-1 flex justify-between text-xs text-text-secondary">
                <span>3명</span><span>10명</span>
              </div>
            </div>

          </div>
        </div>

        {/* 저장 */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            저장
          </button>
        </div>

      </div>

      {/* 우측 미리보기 */}
      <aside className="xl:col-span-3">
        <div className="sticky top-4">
          <div className="rounded-xl border border-border-primary bg-bg-secondary p-4">
            <p className="mb-3 text-xs font-semibold text-text-primary">미리보기</p>
            <div className="rounded-xl border border-border-primary overflow-hidden">
              <div className="relative h-[420px] bg-gradient-to-br from-[#181c24] via-[#11151d] to-[#0b0d12]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.10),_transparent_50%)]" />
                <RankingPreview key={`${config.style}-${config.displayCount}`} config={config} />
              </div>
            </div>
          </div>
        </div>
      </aside>

    </div>
  );
}
