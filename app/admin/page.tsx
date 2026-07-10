'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import StatCard from './components-shared/ui/StatCard';
import StatusBadge from './components-shared/ui/StatusBadge';
import { getPendingSettlements } from '@/app/_apis/admin/settlement';
import { getAdminDashboardSummary } from '@/app/_apis/admin/dashboard';
import type { AdminDashboardSummary } from '@/app/_apis/admin/dashboard';
import { getAdminLiveList } from '@/app/_apis/admin/live';
import type { Settlement } from '@/app/_types/settlement';

const formatKrw = (value: number): string => `${value.toLocaleString('ko-KR')}원`;

export default function AdminDashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [pendingSettlements, setPendingSettlements] = useState<Settlement[]>([]);
  const [liveCount, setLiveCount] = useState<number>(0);
  const [totalViewers, setTotalViewers] = useState<number>(0);
  const [summary, setSummary] = useState<AdminDashboardSummary | null>(null);

  const fetchDashboard = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      // 매출/후원/가입·미처리 신고는 집계 API 하나로, 라이브·정산 목록은 실시간/전체 목록이 필요해 분리 조회
      const [summaryRes, settlementRes, liveRes] = await Promise.allSettled([
        getAdminDashboardSummary(),
        getPendingSettlements(),
        getAdminLiveList(),
      ]);

      if (summaryRes.status === 'fulfilled') {
        setSummary(summaryRes.value);
      }
      if (settlementRes.status === 'fulfilled') {
        setPendingSettlements(settlementRes.value.data.settlements);
      }
      if (liveRes.status === 'fulfilled') {
        const lives = liveRes.value;
        setLiveCount(lives.length);
        setTotalViewers(lives.reduce((sum, l) => sum + (l.viewerCount ?? 0), 0));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">대시보드 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* 실시간 방송 현황 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="현재 라이브" value={liveCount.toLocaleString()} color="red" description="방송 중인 채널" />
        <StatCard title="총 동시 시청자" value={totalViewers.toLocaleString()} color="blue" description="전체 라이브 합산" />
        <StatCard
          title="정산 대기"
          value={`${pendingSettlements.length}건`}
          color="yellow"
          description={formatKrw(pendingSettlements.reduce((sum, s) => sum + (s.total_value ?? 0), 0))}
        />
        <StatCard title="미처리 신고" value={`${summary?.reports.pending ?? 0}건`} color="purple" description="신고 센터 확인 필요" />
      </div>

      {/* 매출/후원 요약 (더미) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">매출 요약</h2>
            <Link href="/admin/payments" className="text-sm text-primary hover:underline">결제 내역 →</Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">오늘</p>
              <p className="text-xl font-bold text-foreground">{formatKrw(summary?.sales.today ?? 0)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">이번 주</p>
              <p className="text-xl font-bold text-foreground">{formatKrw(summary?.sales.week ?? 0)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">이번 달</p>
              <p className="text-xl font-bold text-foreground">{formatKrw(summary?.sales.month ?? 0)}</p>
            </div>
          </div>
          <div className="pt-3 border-t border-border flex justify-between text-sm">
            <span className="text-muted-foreground">오늘 환불</span>
            <span className="text-destructive font-medium">-{formatKrw(summary?.sales.todayRefund ?? 0)}</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">후원 · 가입 현황</h2>
            <Link href="/admin/statistics" className="text-sm text-primary hover:underline">통계 →</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">오늘 후원 코인</p>
              <p className="text-xl font-bold text-foreground">{(summary?.donations.todayCoins ?? 0).toLocaleString()} 코인</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">이번 주 후원 코인</p>
              <p className="text-xl font-bold text-foreground">{(summary?.donations.weekCoins ?? 0).toLocaleString()} 코인</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">오늘 신규 가입</p>
              <p className="text-xl font-bold text-green-600">+{summary?.users.todaySignups ?? 0}명</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">오늘 탈퇴</p>
              <p className="text-xl font-bold text-destructive">-{summary?.users.todayWithdrawals ?? 0}명</p>
            </div>
          </div>
        </div>
      </div>

      {/* 승인 대기 정산 목록 (실 데이터) */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">승인 대기 정산</h2>
          <Link href="/admin/settlement" className="text-sm text-primary hover:underline">정산 관리 →</Link>
        </div>
        {pendingSettlements.length === 0 ? (
          <p className="text-muted-foreground text-sm py-4">승인 대기 중인 정산이 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {pendingSettlements.slice(0, 5).map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between px-4 py-3 rounded-md border border-border bg-background"
              >
                <div className="flex items-center gap-3">
                  <StatusBadge label="대기" tone="yellow" />
                  <span className="font-medium text-foreground">정산 #{s.id}</span>
                </div>
                <span className="font-semibold text-foreground">{formatKrw(s.total_value ?? 0)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
