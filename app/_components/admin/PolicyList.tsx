'use client';
import { Policy } from '@/app/_types/admin';

interface PolicyListProps {
  policies: Policy[];
  selectedPolicy: Policy | null;
  onSelect: (policy: Policy) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number, isActive: boolean) => void;
  loading?: boolean;
}

export default function PolicyList({ 
  policies, 
  selectedPolicy, 
  onSelect, 
  onDelete, 
  onToggleStatus,
  loading = false 
}: PolicyListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeLabel = (type: string) => {
    return type === 'terms' ? '이용약관' : '개인정보처리방침';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (policies.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>정책이 없습니다.</p>
        <p className="text-sm">새 정책을 추가해보세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {policies.map((policy) => (
        <div
          key={policy.id}
          className={`border border-border rounded-lg p-4 cursor-pointer transition-colors ${
            selectedPolicy?.id === policy.id
              ? 'bg-accent border-accent-foreground'
              : 'hover:bg-accent/50'
          }`}
          onClick={() => onSelect(policy)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-medium text-foreground">{policy.title}</h3>
                <span className="px-2 py-1 text-xs bg-muted rounded">
                  {getTypeLabel(policy.type)}
                </span>
                {policy.is_active && (
                  <span className="px-2 py-1 text-xs bg-green-500/10 text-green-600 rounded">
                    활성
                  </span>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground space-y-1">
                <p>버전: {policy.version}</p>
                <p>수정일: {formatDate(policy.updated_at)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStatus(policy.id, !policy.is_active);
                }}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  policy.is_active
                    ? 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20'
                    : 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
                }`}
              >
                {policy.is_active ? '비활성화' : '활성화'}
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('정말 삭제하시겠습니까?')) {
                    onDelete(policy.id);
                  }
                }}
                className="px-2 py-1 text-xs bg-red-500/10 text-red-600 hover:bg-red-500/20 rounded transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}