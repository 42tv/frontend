'use client';
import StatCard from '../components-shared/ui/StatCard';
import DummyNotice from '../components-shared/ui/DummyNotice';

interface BarDatum {
  label: string;
  value: number;
}

// 통계/리포트 집계 API(❌) 연동 전 더미 데이터
const dailySales: BarDatum[] = [
  { label: '6/28', value: 980000 },
  { label: '6/29', value: 1450000 },
  { label: '6/30', value: 1120000 },
  { label: '7/1', value: 1680000 },
  { label: '7/2', value: 1340000 },
  { label: '7/3', value: 1240000 },
  { label: '오늘', value: 810000 },
];

const categoryBroadcasts: BarDatum[] = [
  { label: '게임', value: 42 },
  { label: '토크/일상', value: 35 },
  { label: '먹방', value: 21 },
  { label: '음악', value: 14 },
  { label: '성인', value: 8 },
];

const methodShare: BarDatum[] = [
  { label: '카드', value: 62 },
  { label: '간편결제', value: 28 },
  { label: '가상계좌', value: 10 },
];

const formatKrw = (value: number): string => `${(value / 10000).toLocaleString()}만원`;

/**
 * 단일 시리즈 수평 막대 목록 (magnitude — 단일 색조).
 * 값 라벨을 막대 끝에 직접 표기하고, 표 형태 마크업으로 접근성을 확보합니다.
 */
function HBarList({ data, formatValue }: { data: BarDatum[]; formatValue: (v: number) => string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-2" role="table">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3 group" role="row" title={`${d.label}: ${formatValue(d.value)}`}>
          <span className="w-16 text-sm text-muted-foreground text-right shrink-0" role="rowheader">{d.label}</span>
          <div className="flex-1 h-5 flex items-center">
            <div
              className="h-4 rounded-r bg-primary/80 group-hover:bg-primary transition-colors"
              style={{ width: `${Math.max((d.value / max) * 100, 2)}%` }}
            />
            <span className="ml-2 text-xs font-medium text-foreground whitespace-nowrap" role="cell">
              {formatValue(d.value)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminStatisticsPage() {
  return (
    <div className="space-y-6">
      <DummyNotice api="통계/리포트 집계 API (매출·방송·유저 리포트 — 신규 개발)" />

      {/* 유저 핵심 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="DAU" value="1,842" color="blue" description="일간 활성 유저" />
        <StatCard title="MAU" value="12,304" color="purple" description="월간 활성 유저" />
        <StatCard title="이번 달 순매출" value="3,240만원" color="green" description="결제 - 환불" />
        <StatCard title="본인인증 전환율" value="63%" color="yellow" description="가입 대비 인증 완료" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 일별 매출 */}
        <section className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">일별 매출 (최근 7일)</h2>
            <p className="text-sm text-muted-foreground">결제 성공 금액 기준</p>
          </div>
          <HBarList data={dailySales} formatValue={formatKrw} />
        </section>

        {/* 카테고리별 방송 수 */}
        <section className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">카테고리별 방송 수 (이번 주)</h2>
            <p className="text-sm text-muted-foreground">방송 시작 이벤트 기준</p>
          </div>
          <HBarList data={categoryBroadcasts} formatValue={(v) => `${v}건`} />
        </section>

        {/* 결제수단 비중 */}
        <section className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">결제수단 비중 (이번 달)</h2>
            <p className="text-sm text-muted-foreground">결제 성공 건수 기준</p>
          </div>
          <HBarList data={methodShare} formatValue={(v) => `${v}%`} />
        </section>

        {/* 가입/탈퇴 추이 */}
        <section className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">가입/탈퇴 추이 (최근 4주)</h2>
            <p className="text-sm text-muted-foreground">주간 집계</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2 text-left font-medium">주차</th>
                <th className="py-2 text-right font-medium">신규 가입</th>
                <th className="py-2 text-right font-medium">탈퇴</th>
                <th className="py-2 text-right font-medium">순증</th>
              </tr>
            </thead>
            <tbody>
              {([
                ['6/8 ~', 214, 18],
                ['6/15 ~', 189, 22],
                ['6/22 ~', 246, 15],
                ['6/29 ~', 178, 11],
              ] as const).map(([week, signup, withdraw]) => (
                <tr key={week} className="border-b border-border last:border-b-0">
                  <td className="py-2 text-foreground">{week}</td>
                  <td className="py-2 text-right text-foreground">+{signup}</td>
                  <td className="py-2 text-right text-foreground">-{withdraw}</td>
                  <td className="py-2 text-right font-semibold text-foreground">+{signup - withdraw}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <p className="text-xs text-muted-foreground">
        정산 리포트(월별 지급액, 원천징수 집계)는 정산 관리 메뉴의 원천징수 API(✅ withholding/monthly)를 활용합니다.
      </p>
    </div>
  );
}
