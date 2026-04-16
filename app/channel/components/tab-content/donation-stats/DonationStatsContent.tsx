"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  getDonationSummaryStats,
  getDonationRanking,
  getDonationTrend,
} from "@/app/_apis/donation";
import type {
  DonationStatsData,
  DonationRankingItem,
  DonationTrendItem,
  DonationTrendUnit,
} from "@/app/_types/donation";
import { TrendChart } from "./TrendChart";
import { RankingList } from "./RankingList";

// ── 날짜 유틸 ─────────────────────────────────────────────────────────────────

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getDefaultRange(): { startDate: string; endDate: string } {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 29);
  return { startDate: toDateStr(start), endDate: toDateStr(end) };
}

function fillMissingDays(
  trend: DonationTrendItem[],
  startDate: string,
  endDate: string,
): DonationTrendItem[] {
  const map = new Map(trend.map((t) => [t.period, t]));
  const result: DonationTrendItem[] = [];
  const cursor = new Date(startDate);
  const end = new Date(endDate);
  while (cursor <= end) {
    const key = toDateStr(cursor);
    result.push(
      map.get(key) ?? { period: key, total_coin_amount: 0, total_coin_value: 0, donation_count: 0 },
    );
    cursor.setDate(cursor.getDate() + 1);
  }
  return result;
}

// ── 포맷 유틸 ─────────────────────────────────────────────────────────────────

function formatCount(value: number): string {
  return value.toLocaleString("ko-KR") + "회";
}

// ── 요약 카드 ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, sub }) => (
  <div className="flex-1 min-w-0 p-4 rounded-xl bg-bg-tertiary border border-border-primary">
    <p className="text-xs text-text-secondary mb-1">{label}</p>
    <p className="text-xl font-bold text-text-primary truncate">{value}</p>
    {sub && <p className="text-xs text-text-secondary mt-0.5">{sub}</p>}
  </div>
);

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────

const UNIT_OPTIONS: { value: DonationTrendUnit; label: string }[] = [
  { value: "day", label: "일별" },
  { value: "week", label: "주별" },
  { value: "month", label: "월별" },
];

export const DonationStatsContent: React.FC = () => {
  const defaultRange = getDefaultRange();

  // 입력 상태 (UI 컨트롤에 바인딩)
  const [startDate, setStartDate] = useState(defaultRange.startDate);
  const [endDate, setEndDate] = useState(defaultRange.endDate);
  const [unit, setUnit] = useState<DonationTrendUnit>("day");

  // 실제 조회에 사용되는 파라미터 (조회 버튼 클릭 시 갱신)
  const [appliedParams, setAppliedParams] = useState({
    startDate: defaultRange.startDate,
    endDate: defaultRange.endDate,
    unit: "day" as DonationTrendUnit,
  });

  const [summary, setSummary] = useState<DonationStatsData | null>(null);
  const [ranking, setRanking] = useState<DonationRankingItem[]>([]);
  const [trend, setTrend] = useState<DonationTrendItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    const { startDate: sd, endDate: ed, unit: u } = appliedParams;
    setLoading(true);
    setError(null);
    try {
      const [summaryData, rankingData, trendRaw] = await Promise.all([
        getDonationSummaryStats({ startDate: sd, endDate: ed }),
        getDonationRanking({ startDate: sd, endDate: ed }),
        getDonationTrend({ startDate: sd, endDate: ed, unit: u }),
      ]);

      setSummary(summaryData);
      setRanking(rankingData ?? []);

      const filled = u === "day" ? fillMissingDays(trendRaw ?? [], sd, ed) : (trendRaw ?? []);
      setTrend(filled);
    } catch (err) {
      console.error("후원 통계 조회 실패:", err);
      setError("통계 데이터를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [appliedParams]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleQuery = () => {
    setAppliedParams({ startDate, endDate, unit });
  };

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="pb-4 border-b border-border-primary">
        <h2 className="text-xl font-semibold text-text-primary">후원 통계</h2>
        <p className="text-sm mt-1 text-text-secondary">기간별 후원 현황을 확인할 수 있습니다.</p>
      </div>

      {/* 필터 컨트롤 */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-secondary">시작일</label>
          <input
            type="date"
            value={startDate}
            max={endDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm bg-bg-tertiary border border-border-primary text-text-primary
                       focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-secondary">종료일</label>
          <input
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm bg-bg-tertiary border border-border-primary text-text-primary
                       focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>
        {/* 집계 단위 탭 */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-secondary">집계 단위</label>
          <div className="flex rounded-lg overflow-hidden border border-border-primary">
            {UNIT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setUnit(opt.value)}
                className={`px-4 py-2 text-sm font-medium transition-colors
                  ${unit === opt.value
                    ? "bg-accent text-white"
                    : "bg-bg-tertiary text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleQuery}
          disabled={loading}
          className="px-5 py-2 rounded-lg text-sm font-medium bg-accent text-white
                     hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "조회 중..." : "조회"}
        </button>
      </div>

      {/* 에러 */}
      {error && (
        <div className="p-4 rounded-lg bg-error-bg text-error text-sm border border-error/20">
          {error}
        </div>
      )}

      {/* 로딩 스켈레톤 (최초 로딩) */}
      {loading && !summary && (
        <div className="space-y-4 animate-pulse">
          <div className="flex gap-3">
            {[0, 1].map((i) => (
              <div key={i} className="flex-1 h-20 rounded-xl bg-bg-tertiary" />
            ))}
          </div>
          <div className="h-60 rounded-xl bg-bg-tertiary" />
          <div className="h-40 rounded-xl bg-bg-tertiary" />
        </div>
      )}

      {summary || !loading ? (
        <div className={`space-y-6 transition-opacity duration-200 ${loading ? "opacity-50 pointer-events-none" : ""}`}>
          {/* 요약 카드 */}
          {summary && (
            <div className="flex flex-wrap gap-3">
              <StatCard
                label="총 후원 코인"
                value={summary.total_coin_amount.toLocaleString("ko-KR")}
                sub="코인"
              />
              <StatCard
                label="후원 횟수"
                value={formatCount(summary.donation_count)}
              />
            </div>
          )}

          {/* 추이 차트 */}
          <div className="p-4 rounded-xl bg-bg-secondary border border-border-primary">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary">
                {UNIT_OPTIONS.find((o) => o.value === appliedParams.unit)?.label} 후원 추이
              </h3>
              <span className="text-xs text-text-secondary">
                {appliedParams.startDate} ~ {appliedParams.endDate}
              </span>
            </div>
            <TrendChart data={trend} unit={appliedParams.unit} />
          </div>

          {/* 후원자 순위 */}
          <div className="p-4 rounded-xl bg-bg-secondary border border-border-primary">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary">후원자 TOP 10</h3>
              <span className="text-xs text-text-secondary">기간 내 누적 기준</span>
            </div>
            <RankingList items={ranking} />
          </div>
        </div>
      ) : null}
    </div>
  );
};
