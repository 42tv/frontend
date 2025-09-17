'use client';
import { useEffect, useState } from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red';
  description?: string;
}

function StatCard({ title, value, color, description }: StatCardProps) {
  const colorClasses = {
    blue: 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20',
    green: 'border-l-green-500 bg-green-50/50 dark:bg-green-950/20',
    yellow: 'border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20',
    purple: 'border-l-purple-500 bg-purple-50/50 dark:bg-purple-950/20',
    red: 'border-l-red-500 bg-red-50/50 dark:bg-red-950/20',
  };

  return (
    <div className={`rounded-lg border border-l-4 p-6 ${colorClasses[color]} bg-card`}>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{title}</h3>
        <p className="text-3xl font-bold text-foreground">{value}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

function SystemStatus({ status }: { status: 'healthy' | 'warning' | 'error' }) {
  const statusConfig = {
    healthy: { label: '정상', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30', border: 'border-green-200 dark:border-green-800' },
    warning: { label: '주의', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30', border: 'border-yellow-200 dark:border-yellow-800' },
    error: { label: '오류', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', border: 'border-red-200 dark:border-red-800' },
  };

  const config = statusConfig[status];

  return (
    <div className={`inline-flex items-center px-4 py-2 rounded-lg border ${config.bg} ${config.color} ${config.border}`}>
      <span className="text-sm font-semibold">{config.label}</span>
    </div>
  );
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  // 더미 데이터로 UI 구현
  const stats = {
    total_users: 1234,
    total_channels: 567,
    active_streams: 89,
    total_policies: 4,
    system_status: 'healthy' as const,
    last_updated: new Date().toISOString()
  };

  useEffect(() => {
    // UI 개발을 위한 로딩 시뮬레이션
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

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
      <div>
        <h1 className="text-3xl font-bold text-foreground">대시보드</h1>
        <p className="text-muted-foreground">시스템 전체 현황을 확인하세요</p>
      </div>

      {/* 통계 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="총 사용자 수"
          value={stats.total_users.toLocaleString()}
          color="blue"
          description="전체 등록된 사용자"
        />
        <StatCard
          title="총 채널 수"
          value={stats.total_channels.toLocaleString()}
          color="green"
          description="생성된 방송 채널"
        />
        <StatCard
          title="현재 라이브 스트림"
          value={stats.active_streams.toLocaleString()}
          color="yellow"
          description="실시간 방송 중"
        />
        <StatCard
          title="정책 문서 수"
          value={stats.total_policies.toLocaleString()}
          color="purple"
          description="등록된 정책 문서"
        />
      </div>

      {/* 시스템 상태 */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">시스템 상태</h2>
          <SystemStatus status={stats.system_status} />
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">마지막 업데이트:</span>
            <span className="text-foreground">
              {new Date(stats.last_updated).toLocaleString('ko-KR')}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 bg-background rounded-lg border">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">서버 상태</h4>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-foreground">웹 서버</span>
                  <span className="text-green-600 font-semibold">온라인</span>
                </div>
                <div className="text-sm text-muted-foreground">응답 시간: 15ms</div>
              </div>
            </div>

            <div className="p-6 bg-background rounded-lg border">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">데이터베이스</h4>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-foreground">PostgreSQL</span>
                  <span className="text-green-600 font-semibold">연결됨</span>
                </div>
                <div className="text-sm text-muted-foreground">연결 수: 12/100</div>
              </div>
            </div>

            <div className="p-6 bg-background rounded-lg border">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">스트리밍 서비스</h4>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-foreground">Amazon IVS</span>
                  <span className="text-green-600 font-semibold">정상</span>
                </div>
                <div className="text-sm text-muted-foreground">활성 스트림: {stats.active_streams}개</div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}