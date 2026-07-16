'use client';
import { useCallback, useEffect, useState } from 'react';
import { getAdminPaymentStats } from '@/app/_apis/admin/coin-topup';
import type { AdminPaymentStats } from '@/app/_types/coin-topup';

function formatKRW(value: number): string {
  return `${value.toLocaleString('ko-KR')}원`;
}

function formatCoins(value: number): string {
  return value.toLocaleString('ko-KR');
}

function formatShare(value: number, total: number): string {
  if (total <= 0) return '0%';
  const pct = (value / total) * 100;
  if (pct > 0 && pct < 1) return '1% 미만';
  return `${Math.round(pct)}%`;
}

/** 구성 비율 바의 한 조각 — colorClass는 Tailwind 정적 클래스 문자열 */
interface Segment {
  key: string;
  label: string;
  value: number;
  colorClass: string;
}

interface SegmentBarProps {
  segments: Segment[];
  ariaLabel: string;
}

/** 수평 구성 비율 바 — 세그먼트 사이 2px 서피스 갭, 값 0인 조각은 바에서 제외 */
function SegmentBar({ segments, ariaLabel }: SegmentBarProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const visible = segments.filter((s) => s.value > 0);

  if (total <= 0) {
    return <div className="h-3 rounded bg-muted" role="img" aria-label={`${ariaLabel}: 데이터 없음`} />;
  }

  return (
    <div className="flex h-3 gap-[2px]" role="img" aria-label={ariaLabel}>
      {visible.map((s, i) => (
        <div
          key={s.key}
          title={`${s.label} ${formatCoins(s.value)} (${formatShare(s.value, total)})`}
          className={`${s.colorClass} min-w-[6px] ${i === 0 ? 'rounded-l' : ''} ${
            i === visible.length - 1 ? 'rounded-r' : ''
          }`}
          style={{ flexGrow: s.value }}
        />
      ))}
    </div>
  );
}

interface LegendRowProps {
  segment: Segment;
  total: number;
  formatter?: (value: number) => string;
}

/** 범례 한 줄 — 스와치가 색을, 텍스트는 텍스트 토큰을 입는다 */
function LegendRow({ segment, total, formatter = formatCoins }: LegendRowProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={`h-2.5 w-2.5 shrink-0 rounded-sm ${segment.colorClass}`} aria-hidden />
      <span className="text-muted-foreground">{segment.label}</span>
      <span className="ml-auto font-semibold text-foreground tabular-nums">{formatter(segment.value)}</span>
      <span className="w-14 text-right text-xs text-muted-foreground tabular-nums">
        {formatShare(segment.value, total)}
      </span>
    </div>
  );
}

interface SectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-6 space-y-5">
      <div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  );
}

interface SubStatProps {
  label: string;
  value: string;
  detail?: string;
}

/** 보조 지표 — 히어로보다 한 단계 낮은 위계 */
function SubStat({ label, value, detail }: SubStatProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold text-foreground">{value}</p>
      {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
    </div>
  );
}

// 후원 코인 소진 현황 (2단계 순차 블루 — 라이트/다크 각각 검증 완료)
const COIN_USED_CLASS = 'bg-[#2a78d6] dark:bg-[#3987e5]';
const COIN_REMAINING_CLASS = 'bg-[#86b6ef] dark:bg-[#1c5cab]';

// 정산 코인 파이프라인 (4단계 순차 블루: 대기→완료 흐름 순서, 라이트/다크 각각 검증 완료)
const PAYOUT_STAGE_CLASSES: readonly string[] = [
  'bg-[#86b6ef] dark:bg-[#9ec5f4]', // 대기
  'bg-[#5598e7] dark:bg-[#5598e7]', // 신청 가능
  'bg-[#2a78d6] dark:bg-[#256abf]', // 정산중
  'bg-[#104281] dark:bg-[#184f95]', // 완료
];
// 보류는 파이프라인 밖의 상태 색 (critical) — 항상 라벨과 함께 표기
const PAYOUT_BLOCKED_CLASS = 'bg-[#d03b3b]';

export default function PaymentStatsTab() {
  const [stats, setStats] = useState<AdminPaymentStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const data = await getAdminPaymentStats();
      setStats(data);
    } catch {
      setError('통계 조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="py-12 text-center space-y-3">
        <p className="text-sm text-red-500">{error || '통계 데이터를 불러오지 못했습니다.'}</p>
        <button
          onClick={load}
          className="px-4 py-2 text-sm rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const netRevenue = stats.payments.total_paid_amount - stats.payments.refunded_amount;

  // 환불된 코인은 풀에서 이탈한 분량이므로 충전 코인에서 차감해 순 충전 기준으로 표시
  const netChargedCoins = stats.coins.total_charged_coins - stats.coins.total_refunded_coins;

  const coinSegments: Segment[] = [
    { key: 'used', label: '사용된 코인', value: stats.coins.total_used_coins, colorClass: COIN_USED_CLASS },
    {
      key: 'remaining',
      label: '미사용 잔여 코인',
      value: stats.coins.total_remaining_coins,
      colorClass: COIN_REMAINING_CLASS,
    },
  ];
  const coinTotal = coinSegments.reduce((sum, s) => sum + s.value, 0);

  const payoutSegments: Segment[] = [
    { key: 'waiting', label: '정산 대기', value: stats.payout.waiting_coins, colorClass: PAYOUT_STAGE_CLASSES[0] },
    {
      key: 'available',
      label: '신청 가능',
      value: stats.payout.available_coins,
      colorClass: PAYOUT_STAGE_CLASSES[1],
    },
    {
      key: 'in_settlement',
      label: '정산중',
      value: stats.payout.in_settlement_coins,
      colorClass: PAYOUT_STAGE_CLASSES[2],
    },
    { key: 'completed', label: '정산 완료', value: stats.payout.completed_coins, colorClass: PAYOUT_STAGE_CLASSES[3] },
    { key: 'blocked', label: '⚠ 정산 보류', value: stats.payout.blocked_coins, colorClass: PAYOUT_BLOCKED_CLASS },
  ];
  const payoutTotal = payoutSegments.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="space-y-6">
      {/* 히어로 — 이 화면이 답해야 할 단 하나의 숫자 */}
      <section className="rounded-lg border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">순 매출 (총 결제 − 환불)</p>
        <p className="mt-2 text-5xl font-semibold text-foreground">{formatKRW(netRevenue)}</p>
        <div className="mt-6 grid grid-cols-2 gap-6 border-t border-border pt-5 sm:max-w-md">
          <SubStat
            label="총 결제 금액"
            value={formatKRW(stats.payments.total_paid_amount)}
            detail={`${stats.payments.total_paid_count.toLocaleString('ko-KR')}건`}
          />
          <SubStat
            label="환불 금액"
            value={formatKRW(stats.payments.refunded_amount)}
            detail={`${stats.payments.refunded_count.toLocaleString('ko-KR')}건`}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="후원 코인" description="충전된 코인의 소진 현황 (보너스 코인 포함)">
          <div>
            <p className="text-xs text-muted-foreground">순 충전 코인 (총 충전 − 환불)</p>
            <p className="mt-1 text-3xl font-semibold text-foreground">{formatCoins(netChargedCoins)}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              총 충전 {formatCoins(stats.coins.total_charged_coins)} − 환불{' '}
              {formatCoins(stats.coins.total_refunded_coins)}
            </p>
          </div>
          <SegmentBar segments={coinSegments} ariaLabel="충전 코인 사용/잔여 구성" />
          <div className="space-y-2">
            {coinSegments.map((s) => (
              <LegendRow key={s.key} segment={s} total={coinTotal} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">미사용 잔여 코인은 환불 가능 잔여분입니다.</p>
        </SectionCard>

        <SectionCard title="정산 신청" description="스트리머 정산 신청 처리 현황">
          <div className="grid grid-cols-2 gap-6">
            <SubStat
              label="승인 대기 금액"
              value={formatKRW(stats.settlements.pending_amount)}
              detail={`대기 ${stats.settlements.pending_count.toLocaleString('ko-KR')}건`}
            />
            <SubStat
              label="지급 완료 금액"
              value={formatKRW(stats.settlements.paid_amount)}
              detail={`지급 ${stats.settlements.paid_count.toLocaleString('ko-KR')}건`}
            />
          </div>
          {stats.settlements.pending_count > 0 && (
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
              ⚠ 승인 대기 {stats.settlements.pending_count.toLocaleString('ko-KR')}건이 처리를 기다리고 있습니다.
            </p>
          )}
        </SectionCard>
      </div>

      <SectionCard
        title="정산 코인 (PayoutCoin)"
        description="후원으로 발생한 정산 코인의 단계별 분포 — 대기 → 신청 가능 → 정산중 → 완료"
      >
        <div>
          <p className="text-xs text-muted-foreground">총 정산 코인</p>
          <p className="mt-1 text-3xl font-semibold text-foreground">{formatCoins(payoutTotal)}</p>
        </div>
        <SegmentBar segments={payoutSegments} ariaLabel="정산 코인 단계별 분포" />
        <div className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
          {payoutSegments.map((s) => (
            <LegendRow key={s.key} segment={s} total={payoutTotal} />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">정산 보류는 환불·제재로 차단된 코인입니다.</p>
      </SectionCard>
    </div>
  );
}
