'use client';
import { useMemo } from 'react';
import StatCard from '../../components-shared/ui/StatCard';
import DummyNotice from '../../components-shared/ui/DummyNotice';
import HBarList, { BarDatum } from '../../components-shared/ui/HBarList';
import { dummySanctions } from '../../_data/dummy';
import type { SanctionType } from '@/app/_types/admin-console';

// 회원 통계 집계 API(❌) 연동 전 더미 데이터
const dailySignups: BarDatum[] = [
  { label: '6/30', value: 31 },
  { label: '7/1', value: 47 },
  { label: '7/2', value: 38 },
  { label: '7/3', value: 55 },
  { label: '7/4', value: 61 },
  { label: '7/5', value: 49 },
  { label: '오늘', value: 42 },
];

const providerShare: BarDatum[] = [
  { label: 'Kakao', value: 41 },
  { label: 'Naver', value: 27 },
  { label: 'Google', value: 22 },
  { label: '일반', value: 10 },
];

const verificationStatus: BarDatum[] = [
  { label: '본인인증', value: 9974 },
  { label: '성인인증', value: 4120 },
  { label: '미인증', value: 5858 },
];

const sanctionTypeLabels: Record<SanctionType, string> = {
  ACCOUNT_SUSPEND: '계정 정지',
  BROADCAST_BAN: '방송 정지',
  WARNING: '경고',
};

export default function UserStatsTab() {
  // 활성 제재 유형별 건수 — 관리자 제재 이력 API(❌) 연동 지점
  const activeSanctions: BarDatum[] = useMemo(() => {
    const active = dummySanctions.filter((s) => s.status === 'ACTIVE');
    return (Object.keys(sanctionTypeLabels) as SanctionType[]).map((type) => ({
      label: sanctionTypeLabels[type],
      value: active.filter((s) => s.type === type).length,
    }));
  }, []);

  const activeSanctionTotal: number = activeSanctions.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="space-y-6">
      <DummyNotice api="회원 통계 집계 API (가입 추이·가입 경로·인증 현황 — 신규 개발)" />

      {/* 회원 핵심 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="전체 회원" value="15,832" color="blue" description="탈퇴 제외 누적" />
        <StatCard title="오늘 신규 가입" value="42" color="green" description="탈퇴 3명 · 순증 +39" />
        <StatCard title="본인인증 완료율" value="63%" color="purple" description="가입 대비 CI 인증 완료" />
        <StatCard title="활성 제재" value={`${activeSanctionTotal}건`} color="red" description="계정 정지 · 방송 정지 · 경고" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 일별 신규 가입 */}
        <section className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">일별 신규 가입 (최근 7일)</h2>
            <p className="text-sm text-muted-foreground">가입 완료 이벤트 기준</p>
          </div>
          <HBarList data={dailySignups} formatValue={(v) => `${v}명`} />
        </section>

        {/* 가입 경로 비중 */}
        <section className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">가입 경로 비중</h2>
            <p className="text-sm text-muted-foreground">전체 회원 기준</p>
          </div>
          <HBarList data={providerShare} formatValue={(v) => `${v}%`} />
        </section>

        {/* 인증 현황 */}
        <section className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">인증 현황</h2>
            <p className="text-sm text-muted-foreground">
              CI 해시 기반 본인인증 · 성인인증 (주민등록번호 미수집, §16-1)
            </p>
          </div>
          <HBarList data={verificationStatus} formatValue={(v) => `${v.toLocaleString()}명`} />
        </section>

        {/* 활성 제재 현황 */}
        <section className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">활성 제재 현황</h2>
            <p className="text-sm text-muted-foreground">현재 적용 중인 제재 유형별 건수</p>
          </div>
          <HBarList data={activeSanctions} formatValue={(v) => `${v}건`} />
        </section>
      </div>

      <p className="text-xs text-muted-foreground">
        제재 등록·해제는 회원 검색 탭에서 회원을 선택한 뒤 상세 모달에서 진행합니다.
      </p>
    </div>
  );
}
