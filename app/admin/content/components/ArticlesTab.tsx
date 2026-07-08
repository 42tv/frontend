'use client';
import { useCallback, useEffect, useState } from 'react';
import DataTable, { Column } from '../../components-shared/ui/DataTable';
import AdminModal from '../../components-shared/ui/AdminModal';
import useUserStore from '@/app/_lib/stores/userStore';
import { getArticles, createArticle, deleteArticle } from '@/app/_apis/article';
import type { Article } from '@/app/_types/article';

interface ArticleForm {
  title: string;
  content: string;
}

const emptyForm: ArticleForm = { title: '', content: '' };

/**
 * 공지/게시글 관리 — article API 실 연동 (현재 MemberGuard, AdminGuard 전환 예정 🔧).
 * 목록은 로그인한 관리자 본인 계정의 게시글 기준으로 조회합니다.
 */
export default function ArticlesTab() {
  const { idx: myIdx } = useUserStore();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showWriteModal, setShowWriteModal] = useState<boolean>(false);
  const [form, setForm] = useState<ArticleForm>(emptyForm);
  const [saving, setSaving] = useState<boolean>(false);

  const fetchArticles = useCallback(async (): Promise<void> => {
    if (!myIdx) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await getArticles({ userId: String(myIdx), page: 1, limit: 20 });
      setArticles(response.data ?? []);
    } catch {
      setErrorMessage('게시글 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [myIdx]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleCreate = async (): Promise<void> => {
    if (!form.title.trim() || !form.content.trim() || saving) return;
    setSaving(true);
    try {
      await createArticle({ title: form.title.trim(), content: form.content.trim() });
      setForm(emptyForm);
      setShowWriteModal(false);
      await fetchArticles();
    } catch {
      setErrorMessage('게시글 작성에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await deleteArticle(id);
      await fetchArticles();
    } catch {
      setErrorMessage('게시글 삭제에 실패했습니다.');
    }
  };

  const columns: Column<Article>[] = [
    { key: 'title', header: '제목', className: 'max-w-sm', render: (a) => <span className="font-medium line-clamp-1">{a.title}</span> },
    { key: 'views', header: '조회수', render: (a) => a.viewCount.toLocaleString() },
    { key: 'created_at', header: '작성일', render: (a) => new Date(a.createdAt).toLocaleDateString('ko-KR') },
    {
      key: 'actions',
      header: '',
      render: (a) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(a.id);
          }}
          className="px-3 py-1 text-xs rounded-md border border-border text-destructive hover:bg-destructive/10 transition-colors"
        >
          삭제
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          현재 게시글 API는 MemberGuard 보호 상태입니다. AdminGuard 전환(🔧) 후 전체 유저 게시글 관리가 가능해집니다.
        </p>
        <button
          onClick={() => setShowWriteModal(true)}
          className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity shrink-0"
        >
          + 공지 작성
        </button>
      </div>

      {errorMessage && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">{errorMessage}</p>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      ) : (
        <DataTable columns={columns} rows={articles} rowKey={(a) => a.id} emptyMessage="작성된 게시글이 없습니다" />
      )}

      <AdminModal
        open={showWriteModal}
        title="공지 작성"
        onClose={() => setShowWriteModal(false)}
        footer={
          <>
            <button
              onClick={() => setShowWriteModal(false)}
              className="px-4 py-2 text-sm rounded-md border border-border text-muted-foreground hover:text-foreground"
            >
              취소
            </button>
            <button
              onClick={handleCreate}
              disabled={!form.title.trim() || !form.content.trim() || saving}
              className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {saving ? '저장 중...' : '등록'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">제목</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">내용</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={8}
              className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
