'use client';
import { useCallback, useEffect, useState } from 'react';
import DataTable, { Column } from '../../components-shared/ui/DataTable';
import StatusBadge from '../../components-shared/ui/StatusBadge';
import {
  getBannedWords,
  createBannedWord,
  deleteBannedWord,
  broadcastGlobalNotice,
} from '@/app/_apis/admin/chat';
import { extractAdminApiError } from '@/app/_apis/admin/user';
import type { BannedWord, BannedWordAction } from '@/app/_types/admin-console';

export default function ChatManageTab() {
  const [bannedWords, setBannedWords] = useState<BannedWord[]>([]);
  const [wordsLoading, setWordsLoading] = useState<boolean>(true);
  const [wordsError, setWordsError] = useState<string>('');
  const [newWord, setNewWord] = useState<string>('');
  const [newAction, setNewAction] = useState<BannedWordAction>('MASK');
  const [saving, setSaving] = useState<boolean>(false);

  const [broadcastMessage, setBroadcastMessage] = useState<string>('');
  const [broadcastSending, setBroadcastSending] = useState<boolean>(false);
  const [broadcastResult, setBroadcastResult] = useState<{ ok: boolean; text: string } | null>(null);

  const loadWords = useCallback(async (): Promise<void> => {
    setWordsError('');
    try {
      setBannedWords(await getBannedWords());
    } catch (e) {
      setWordsError(extractAdminApiError(e, '금칙어 목록 조회 중 오류가 발생했습니다.'));
    } finally {
      setWordsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWords();
  }, [loadWords]);

  const handleAddWord = async (): Promise<void> => {
    const word = newWord.trim();
    if (!word || saving) return;
    setSaving(true);
    setWordsError('');
    try {
      await createBannedWord(word, newAction);
      setNewWord('');
      await loadWords();
    } catch (e) {
      setWordsError(extractAdminApiError(e, '금칙어 등록 중 오류가 발생했습니다.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteWord = async (id: number): Promise<void> => {
    setWordsError('');
    try {
      await deleteBannedWord(id);
      setBannedWords((words) => words.filter((w) => w.id !== id));
    } catch (e) {
      setWordsError(extractAdminApiError(e, '금칙어 삭제 중 오류가 발생했습니다.'));
    }
  };

  const handleBroadcast = async (): Promise<void> => {
    const message = broadcastMessage.trim();
    if (!message || broadcastSending) return;
    setBroadcastSending(true);
    setBroadcastResult(null);
    try {
      await broadcastGlobalNotice(message);
      setBroadcastMessage('');
      setBroadcastResult({ ok: true, text: '전체 공지가 발송되었습니다.' });
    } catch (e) {
      setBroadcastResult({
        ok: false,
        text: extractAdminApiError(e, '공지 발송 중 오류가 발생했습니다.'),
      });
    } finally {
      setBroadcastSending(false);
    }
  };

  const wordColumns: Column<BannedWord>[] = [
    { key: 'word', header: '금칙어', render: (w) => <span className="font-medium">{w.word}</span> },
    {
      key: 'action',
      header: '처리 방식',
      render: (w) =>
        w.action === 'MASK'
          ? <StatusBadge label="마스킹" tone="yellow" />
          : <StatusBadge label="차단" tone="red" />,
    },
    { key: 'created_at', header: '등록일', render: (w) => new Date(w.created_at).toLocaleDateString('ko-KR') },
    {
      key: 'actions',
      header: '',
      render: (w) => (
        <button
          onClick={() => handleDeleteWord(w.id)}
          className="px-3 py-1 text-xs rounded-md border border-border text-destructive hover:bg-destructive/10 transition-colors"
        >
          삭제
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* 전체 공지 */}
      <section className="bg-card border border-border rounded-lg p-6 space-y-3">
        <h3 className="text-lg font-semibold text-foreground">전체 공지 브로드캐스트</h3>
        <p className="text-sm text-muted-foreground">
          모든 라이브 채팅방에 시스템 메시지를 발송합니다. Redis Pub/Sub을 통해 전 서버에 전파됩니다.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={broadcastMessage}
            onChange={(e) => setBroadcastMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleBroadcast()}
            placeholder="공지 메시지 입력"
            className="flex-1 px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={handleBroadcast}
            disabled={!broadcastMessage.trim() || broadcastSending}
            className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {broadcastSending ? '발송 중...' : '발송'}
          </button>
        </div>
        {broadcastResult && (
          <p className={`text-sm ${broadcastResult.ok ? 'text-green-600' : 'text-red-500'}`}>
            {broadcastResult.text}
          </p>
        )}
      </section>

      {/* 금칙어 관리 */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">금칙어 관리</h3>
        <p className="text-sm text-muted-foreground">
          등록/삭제 즉시 전 서버 채팅 필터에 반영됩니다.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddWord()}
            placeholder="금칙어 입력"
            className="w-64 px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <select
            value={newAction}
            onChange={(e) => setNewAction(e.target.value as BannedWordAction)}
            className="px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="MASK">마스킹 (***)</option>
            <option value="BLOCK">차단 (전송 불가)</option>
          </select>
          <button
            onClick={handleAddWord}
            disabled={!newWord.trim() || saving}
            className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {saving ? '등록 중...' : '추가'}
          </button>
        </div>
        {wordsError && (
          <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md px-4 py-3">
            {wordsError}
          </p>
        )}
        {wordsLoading ? (
          <div className="py-16 flex justify-center bg-card border border-border rounded-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        ) : (
          <DataTable columns={wordColumns} rows={bannedWords} rowKey={(w) => w.id} emptyMessage="등록된 금칙어가 없습니다" />
        )}
      </section>
    </div>
  );
}
