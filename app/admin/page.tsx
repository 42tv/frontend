'use client';
import { useEffect, useState } from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red';
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    green: 'bg-green-500/10 text-green-600 border-green-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    purple: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    red: 'bg-red-500/10 text-red-600 border-red-500/20',
  };

  return (
    <div className={`rounded-lg border p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
}

function SystemStatus({ status }: { status: 'healthy' | 'warning' | 'error' }) {
  const statusConfig = {
    healthy: { label: '정상', color: 'text-green-600', bg: 'bg-green-500/10', icon: '✅' },
    warning: { label: '주의', color: 'text-yellow-600', bg: 'bg-yellow-500/10', icon: '⚠️' },
    error: { label: '오류', color: 'text-red-600', bg: 'bg-red-500/10', icon: '❌' },
  };

  const config = statusConfig[status];

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${config.bg} ${config.color}`}>
      <span>{config.icon}</span>
      <span className="text-sm font-medium">{config.label}</span>
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
          icon="👥"
          color="blue"
        />
        <StatCard
          title="총 채널 수"
          value={stats.total_channels.toLocaleString()}
          icon="📺"
          color="green"
        />
        <StatCard
          title="현재 라이브 스트림"
          value={stats.active_streams.toLocaleString()}
          icon="🔴"
          color="yellow"
        />
        <StatCard
          title="정책 문서 수"
          value={stats.total_policies.toLocaleString()}
          icon="📋"
          color="purple"
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="text-center p-4 bg-background rounded-lg">
              <div className="text-2xl mb-2">🌐</div>
              <div className="text-sm text-muted-foreground">서버 상태</div>
              <div className="text-green-600 font-medium">온라인</div>
            </div>
            
            <div className="text-center p-4 bg-background rounded-lg">
              <div className="text-2xl mb-2">💾</div>
              <div className="text-sm text-muted-foreground">데이터베이스</div>
              <div className="text-green-600 font-medium">연결됨</div>
            </div>
            
            <div className="text-center p-4 bg-background rounded-lg">
              <div className="text-2xl mb-2">📡</div>
              <div className="text-sm text-muted-foreground">스트리밍 서비스</div>
              <div className="text-green-600 font-medium">정상</div>
            </div>
          </div>
        </div>
      </div>

      {/* 빠른 액세스 */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">빠른 액세스</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/admin/policy"
            className="flex items-center gap-3 p-4 bg-background rounded-lg hover:bg-accent transition-colors"
          >
            <span className="text-2xl">📋</span>
            <div>
              <div className="font-medium text-foreground">정책 관리</div>
              <div className="text-sm text-muted-foreground">이용약관, 개인정보처리방침</div>
            </div>
          </a>
          
          <a
            href="/admin/users"
            className="flex items-center gap-3 p-4 bg-background rounded-lg hover:bg-accent transition-colors"
          >
            <span className="text-2xl">👥</span>
            <div>
              <div className="font-medium text-foreground">사용자 관리</div>
              <div className="text-sm text-muted-foreground">사용자 계정 관리</div>
            </div>
          </a>
          
          <a
            href="/admin/channels"
            className="flex items-center gap-3 p-4 bg-background rounded-lg hover:bg-accent transition-colors"
          >
            <span className="text-2xl">📺</span>
            <div>
              <div className="font-medium text-foreground">채널 관리</div>
              <div className="text-sm text-muted-foreground">방송 채널 관리</div>
            </div>
          </a>
          
          <a
            href="/admin/system"
            className="flex items-center gap-3 p-4 bg-background rounded-lg hover:bg-accent transition-colors"
          >
            <span className="text-2xl">⚙️</span>
            <div>
              <div className="font-medium text-foreground">시스템 설정</div>
              <div className="text-sm text-muted-foreground">전역 설정 관리</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}