'use client';
import { useCallback, useEffect, useState } from 'react';
import DataTable, { Column } from '../../components-shared/ui/DataTable';
import StatusBadge, { BadgeTone } from '../../components-shared/ui/StatusBadge';
import UserDetailModal from './UserDetailModal';
import { getAdminUsers } from '@/app/_apis/admin/user';
import type {
  AdminUserListItem,
  UserSanctionStatus,
  OAuthProvider,
} from '@/app/_types/admin-console';

const statusLabels: Record<UserSanctionStatus, { label: string; tone: BadgeTone }> = {
  ACTIVE: { label: '정상', tone: 'green' },
  SUSPENDED: { label: '계정 정지', tone: 'red' },
  BROADCAST_BANNED: { label: '방송 정지', tone: 'purple' },
};

const providerLabels: Record<OAuthProvider, string> = {
  GOOGLE: 'Google',
  KAKAO: 'Kakao',
  NAVER: 'Naver',
  LOCAL: '일반',
};

const PAGE_SIZE = 20;

/** 활성 제재 목록으로 회원 상태 도출 (계정 정지 > 방송 정지) */
const deriveStatus = (user: AdminUserListItem): UserSanctionStatus => {
  const sanctions = user.active_sanctions ?? [];
  if (sanctions.some((s) => s.type === 'ACCOUNT_SUSPEND')) return 'SUSPENDED';
  if (sanctions.some((s) => s.type === 'BROADCAST_BAN')) return 'BROADCAST_BANNED';
  return 'ACTIVE';
};

export default function UserListTab() {
  const [searchInput, setSearchInput] = useState<string>('');
  /** 실행된 검색어 — 빈 문자열이면 아직 검색 전 */
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [selectedUserIdx, setSelectedUserIdx] = useState<number | null>(null);

  const load = useCallback(async (): Promise<void> => {
    if (!query) return;
    setLoading(true);
    setError('');
    try {
      const result = await getAdminUsers({
        search: query,
        page,
        limit: PAGE_SIZE,
      });
      setUsers(result.users);
      setTotal(result.pagination.total);
      setTotalPages(result.pagination.totalPages);
    } catch {
      setError('회원 검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [query, page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (): void => {
    const trimmed = searchInput.trim();
    if (!trimmed) return;
    setPage(1);
    setQuery(trimmed);
  };

  const columns: Column<AdminUserListItem>[] = [
    { key: 'user_id', header: '아이디', render: (u) => <span className="font-mono">{u.user_id}</span> },
    {
      key: 'nickname',
      header: '닉네임',
      render: (u) => (
        <span className="font-medium">
          {u.nickname}
          {u.is_admin && <span className="ml-1.5 text-xs text-primary font-semibold">관리자</span>}
        </span>
      ),
    },
    { key: 'provider', header: '가입 경로', render: (u) => providerLabels[u.oauth_provider] ?? u.oauth_provider },
    {
      key: 'identity',
      header: '본인인증',
      render: (u) =>
        u.is_identity_verified
          ? <StatusBadge label="완료" tone="green" />
          : <StatusBadge label="미인증" tone="gray" />,
    },
    {
      key: 'status',
      header: '상태',
      render: (u) => {
        const status = deriveStatus(u);
        return <StatusBadge label={statusLabels[status].label} tone={statusLabels[status].tone} />;
      },
    },
    {
      key: 'coin',
      header: '보유 코인',
      className: 'text-right',
      render: (u) => u.coin_balance.toLocaleString(),
    },
    {
      key: 'created_at',
      header: '가입일',
      render: (u) => new Date(u.created_at).toLocaleDateString('ko-KR'),
    },
  ];

  return (
    <div className="space-y-4">
      {/* 검색 바 */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xl">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="user_id 또는 닉네임으로 검색"
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !searchInput.trim()}
            className="px-5 py-2.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            검색
          </button>
          {query && (
            <span className="text-sm text-muted-foreground ml-auto">
              &lsquo;{query}&rsquo; 검색 결과 {total.toLocaleString()}명
            </span>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md px-4 py-3">
          {error}
        </p>
      )}

      {/* 검색 전 안내 */}
      {!query && (
        <div className="py-20 flex flex-col items-center gap-2 bg-card border border-border rounded-lg">
          <svg
            className="h-10 w-10 text-muted-foreground/50 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
          </svg>
          <p className="font-medium text-foreground">회원 검색</p>
          <p className="text-sm text-muted-foreground">
            user_id 또는 닉네임을 입력해 회원을 검색하세요.
            <br />
            검색 결과에서 회원을 선택하면 상세 정보 확인과 제재를 할 수 있습니다.
          </p>
        </div>
      )}

      {/* 검색 결과 */}
      {query && (loading ? (
        <div className="py-16 flex justify-center bg-card border border-border rounded-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={users}
          rowKey={(u) => u.idx}
          onRowClick={(u) => setSelectedUserIdx(u.idx)}
          emptyMessage="검색 결과가 없습니다"
        />
      ))}

      {/* 페이지네이션 */}
      {query && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
            className="px-3 py-1.5 text-sm rounded-md border border-border text-foreground hover:bg-accent disabled:opacity-40 transition-colors"
          >
            이전
          </button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || loading}
            className="px-3 py-1.5 text-sm rounded-md border border-border text-foreground hover:bg-accent disabled:opacity-40 transition-colors"
          >
            다음
          </button>
        </div>
      )}

      <UserDetailModal
        userIdx={selectedUserIdx}
        onClose={() => setSelectedUserIdx(null)}
        onUpdated={load}
      />
    </div>
  );
}
