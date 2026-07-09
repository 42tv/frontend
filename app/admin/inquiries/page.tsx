'use client';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import DataTable, { Column } from '../components-shared/ui/DataTable';
import StatusBadge, { BadgeTone } from '../components-shared/ui/StatusBadge';
import AdminModal from '../components-shared/ui/AdminModal';
import PageHeader from '../components-shared/ui/PageHeader';
import {
  answerInquiry,
  getAdminInquiries,
  getAdminInquiry,
} from '@/app/_apis/admin/inquiry';
import { extractAdminApiError } from '@/app/_apis/admin/user';
import type { Inquiry, InquiryStatus, InquiryType } from '@/app/_types/inquiry';
import { inquiryTypeLabels } from '@/app/_types/inquiry';
import { notifyAdminPendingRefresh } from '../_hooks/useAdminPendingCounts';

const statusLabels: Record<InquiryStatus, { label: string; tone: BadgeTone }> = {
  PENDING: { label: '답변 대기', tone: 'yellow' },
  ANSWERED: { label: '답변 완료', tone: 'green' },
};

type StatusFilter = 'ALL' | InquiryStatus;
type TypeFilter = 'ALL' | InquiryType;

const PAGE_SIZE = 20;

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('ALL');
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [answerText, setAnswerText] = useState<string>('');
  const [answerSubmitting, setAnswerSubmitting] = useState<boolean>(false);
  const [answerError, setAnswerError] = useState<string>('');

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const result = await getAdminInquiries({
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        type: typeFilter === 'ALL' ? undefined : typeFilter,
        page,
        limit: PAGE_SIZE,
      });
      setInquiries(result.inquiries);
      setTotal(result.pagination.total);
      setTotalPages(result.pagination.totalPages);
    } catch (err: unknown) {
      setError(extractAdminApiError(err, '문의 목록 조회 중 오류가 발생했습니다.'));
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter, page]);

  useEffect(() => {
    load();
  }, [load]);

  const openDetail = async (inquiry: Inquiry): Promise<void> => {
    setSelected(inquiry);
    setAnswerText(inquiry.answer ?? '');
    setAnswerError('');
    setDetailLoading(true);
    try {
      // 목록 응답에도 이미지가 포함되지만, 최신 상태(답변/읽음)를 상세 조회로 동기화
      const detail = await getAdminInquiry(inquiry.id);
      setSelected(detail);
      setAnswerText(detail.answer ?? '');
    } catch (err: unknown) {
      setAnswerError(extractAdminApiError(err, '문의 상세 조회 중 오류가 발생했습니다.'));
    } finally {
      setDetailLoading(false);
    }
  };

  const handleAnswer = async (): Promise<void> => {
    if (!selected || !answerText.trim()) return;
    setAnswerSubmitting(true);
    setAnswerError('');
    try {
      await answerInquiry(selected.id, answerText.trim());
      setSelected(null);
      await load();
      notifyAdminPendingRefresh(); // 사이드바 미처리 뱃지 즉시 갱신
    } catch (err: unknown) {
      setAnswerError(extractAdminApiError(err, '답변 등록 중 오류가 발생했습니다.'));
    } finally {
      setAnswerSubmitting(false);
    }
  };

  const columns: Column<Inquiry>[] = [
    { key: 'id', header: 'ID', render: (i) => <span className="font-mono">#{i.id}</span> },
    { key: 'type', header: '유형', render: (i) => inquiryTypeLabels[i.type] },
    {
      key: 'title',
      header: '제목',
      className: 'max-w-xs',
      render: (i) => (
        <span className={`line-clamp-1 ${i.status === 'PENDING' ? 'font-semibold' : ''}`}>
          {i.title}
          {i.images.length > 0 && (
            <span className="ml-1.5 text-xs text-muted-foreground">📎{i.images.length}</span>
          )}
        </span>
      ),
    },
    {
      key: 'user',
      header: '작성자',
      render: (i) => (
        <div>
          <div className="font-medium">{i.user?.nickname ?? '-'}</div>
          <div className="text-xs text-muted-foreground font-mono">{i.user?.user_id ?? ''}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: '상태',
      render: (i) => <StatusBadge label={statusLabels[i.status].label} tone={statusLabels[i.status].tone} />,
    },
    { key: 'created_at', header: '접수일', render: (i) => new Date(i.created_at).toLocaleString('ko-KR') },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="1:1 문의"
        description="사용자 문의 접수 내역을 확인하고 답변합니다. 신고는 신고 센터에서 처리하세요."
      />

      {/* 필터 */}
      <div className="flex flex-wrap items-center gap-2">
        {(['ALL', 'PENDING', 'ANSWERED'] as const).map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
              statusFilter === s
                ? 'border-primary bg-primary text-primary-foreground font-medium'
                : 'border-border text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            {s === 'ALL' ? '전체' : statusLabels[s].label}
          </button>
        ))}

        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value as TypeFilter); setPage(1); }}
          className="ml-2 px-3 py-1.5 text-sm rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="ALL">전체 유형</option>
          {(Object.entries(inquiryTypeLabels) as [InquiryType, string][]).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <span className="text-sm text-muted-foreground ml-auto">총 {total.toLocaleString()}건</span>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md px-4 py-3">{error}</p>
      )}

      {loading ? (
        <div className="py-16 flex justify-center bg-card border border-border rounded-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={inquiries}
          rowKey={(i) => i.id}
          onRowClick={openDetail}
          emptyMessage="문의 내역이 없습니다"
        />
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
            className="px-3 py-1.5 text-sm rounded-md border border-border text-foreground hover:bg-accent disabled:opacity-40 transition-colors"
          >
            이전
          </button>
          <span className="text-sm text-muted-foreground">{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || loading}
            className="px-3 py-1.5 text-sm rounded-md border border-border text-foreground hover:bg-accent disabled:opacity-40 transition-colors"
          >
            다음
          </button>
        </div>
      )}

      {/* 문의 상세 + 답변 */}
      <AdminModal
        open={selected !== null}
        title={`문의 상세 #${selected?.id ?? ''}`}
        onClose={() => setSelected(null)}
        footer={
          selected ? (
            <button
              onClick={handleAnswer}
              disabled={answerSubmitting || detailLoading || !answerText.trim()}
              className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {answerSubmitting
                ? '등록 중...'
                : selected.status === 'ANSWERED'
                  ? '답변 수정'
                  : '답변 등록'}
            </button>
          ) : undefined
        }
      >
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-muted-foreground">문의 유형</div>
                <div className="font-medium text-foreground">{inquiryTypeLabels[selected.type]}</div>
              </div>
              <div>
                <div className="text-muted-foreground">상태</div>
                <StatusBadge label={statusLabels[selected.status].label} tone={statusLabels[selected.status].tone} />
              </div>
              <div>
                <div className="text-muted-foreground">작성자</div>
                <div className="font-medium text-foreground">
                  {selected.user?.nickname ?? '-'}{' '}
                  <span className="text-xs text-muted-foreground font-mono">({selected.user?.user_id ?? ''})</span>
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">접수일</div>
                <div className="text-foreground">{new Date(selected.created_at).toLocaleString('ko-KR')}</div>
              </div>
            </div>

            <div>
              <div className="text-muted-foreground">제목</div>
              <div className="font-medium text-foreground">{selected.title}</div>
            </div>
            <div>
              <div className="text-muted-foreground">내용</div>
              <div className="text-foreground whitespace-pre-wrap">{selected.content}</div>
            </div>

            {selected.images.length > 0 && (
              <div>
                <div className="text-muted-foreground mb-1.5">첨부 이미지</div>
                <div className="flex flex-wrap gap-2">
                  {selected.images.map((image) => (
                    <a
                      key={image.id}
                      href={image.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative w-20 h-20 rounded-md overflow-hidden border border-border hover:opacity-80 transition-opacity"
                    >
                      <Image
                        src={image.image_url}
                        alt={`첨부 이미지 ${image.image_order + 1}`}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {selected.status === 'ANSWERED' && selected.answered_at && (
              <div className="text-xs text-muted-foreground">
                기존 답변 {new Date(selected.answered_at).toLocaleString('ko-KR')}
                {selected.answerer && ` · ${selected.answerer.nickname}`}
                {' — 수정 시 사용자에게 미읽음 상태로 다시 표시됩니다.'}
              </div>
            )}

            <div className="pt-2 border-t border-border">
              <div className="text-muted-foreground mb-1.5">답변</div>
              <textarea
                value={answerText}
                maxLength={3000}
                onChange={(e) => setAnswerText(e.target.value)}
                rows={5}
                disabled={detailLoading || answerSubmitting}
                placeholder="답변 내용을 입력하세요 (최대 3000자)"
                className="w-full px-3 py-2.5 text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-y disabled:opacity-50"
              />
              {answerError && <p className="text-xs text-red-500 mt-1">{answerError}</p>}
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
