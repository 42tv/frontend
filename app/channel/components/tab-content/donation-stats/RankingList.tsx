"use client";

import React from "react";
import Image from "next/image";
import type { DonationRankingItem } from "@/app/_types/donation";

interface RankingListProps {
  items: DonationRankingItem[];
}

const RANK_COLORS: Record<number, string> = {
  1: "text-yellow-500",
  2: "text-slate-400",
  3: "text-amber-600",
};

export const RankingList: React.FC<RankingListProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-10 text-text-secondary text-sm">
        순위 데이터가 없습니다.
      </div>
    );
  }

  const maxCoin = items[0]?.total_coin_amount ?? 1;

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const barPct = maxCoin > 0 ? (item.total_coin_amount / maxCoin) * 100 : 0;
        const rankColor = RANK_COLORS[item.rank] ?? "text-text-secondary";

        return (
          <div
            key={item.donor.idx}
            className="flex items-center gap-3 p-3 rounded-lg bg-bg-tertiary hover:bg-bg-100 transition-colors"
          >
            {/* 순위 */}
            <span className={`w-6 text-center font-bold text-sm shrink-0 ${rankColor}`}>
              {item.rank}
            </span>

            {/* 프로필 이미지 */}
            <div className="w-8 h-8 rounded-full overflow-hidden bg-bg-secondary shrink-0">
              {item.donor.profile_img ? (
                <Image
                  src={item.donor.profile_img}
                  alt={item.donor.nickname}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-accent opacity-30" />
              )}
            </div>

            {/* 닉네임 + 바 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-text-primary truncate">
                  {item.donor.nickname}
                </span>
                <span className="text-xs text-text-secondary shrink-0 ml-2">
                  {item.donation_count}회
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-500"
                  style={{ width: `${barPct}%` }}
                />
              </div>
            </div>

            {/* 금액 */}
            <span className="text-sm font-semibold text-text-primary shrink-0 w-24 text-right">
              {item.total_coin_amount.toLocaleString("ko-KR")}코인
            </span>
          </div>
        );
      })}
    </div>
  );
};
