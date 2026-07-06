'use client';
import { useState } from 'react';
import DataTable, { Column } from '../../components-shared/ui/DataTable';
import StatusBadge from '../../components-shared/ui/StatusBadge';
import DummyNotice from '../../components-shared/ui/DummyNotice';
import { dummyBannedWords, dummyChatBans } from '../../_data/dummy';
import type { BannedWord, BannedWordAction, ChatBan } from '@/app/_types/admin-console';

export default function ChatManageTab() {
  const [bannedWords, setBannedWords] = useState<BannedWord[]>(dummyBannedWords);
  const [newWord, setNewWord] = useState<string>('');
  const [newAction, setNewAction] = useState<BannedWordAction>('MASK');
  const [broadcastMessage, setBroadcastMessage] = useState<string>('');
  const [broadcastSent, setBroadcastSent] = useState<boolean>(false);

  // 금칙어 추가 — 금칙어 CRUD API(❌) 연동 지점
  const handleAddWord = (): void => {
    const word = newWord.trim();
    if (!word || bannedWords.some((w) => w.word === word)) return;
    setBannedWords([
      { id: Math.max(0, ...bannedWords.map((w) => w.id)) + 1, word, action: newAction, created_at: new Date().toISOString(), admin_nickname: '나' },
      ...bannedWords,
    ]);
    setNewWord('');
  };

  const handleDeleteWord = (id: number): void => {
    setBannedWords(bannedWords.filter((w) => w.id !== id));
  };

  // 전체 공지 — 전 라이브 채팅방 시스템 메시지 발송 API(❌, Redis Pub/Sub 전파) 연동 지점
  const handleBroadcast = (): void => {
    if (!broadcastMessage.trim()) return;
    console.info(`[전체 공지] ${broadcastMessage.trim()}`);
    setBroadcastMessage('');
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 3000);
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
    { key: 'admin', header: '등록자', render: (w) => w.admin_nickname },
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

  const banColumns: Column<ChatBan>[] = [
    {
      key: 'user',
      header: '대상',
      render: (b) => (
        <div>
          <div className="font-medium">{b.nickname}</div>
          <div className="text-xs text-muted-foreground font-mono">{b.user_id}</div>
        </div>
      ),
    },
    {
      key: 'scope',
      header: '범위',
      render: (b) =>
        b.scope === 'GLOBAL'
          ? <StatusBadge label="플랫폼 전체" tone="red" />
          : <StatusBadge label={`${b.broadcaster_id} 방송`} tone="yellow" />,
    },
    { key: 'reason', header: '사유', render: (b) => b.reason },
    {
      key: 'ends_at',
      header: '해제 예정',
      render: (b) =>
        b.ends_at ? new Date(b.ends_at).toLocaleDateString('ko-KR') : <span className="text-destructive font-medium">영구</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <DummyNotice api="금칙어 CRUD · 채팅 금지 · 전체 공지 브로드캐스트 API" />

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
            disabled={!broadcastMessage.trim()}
            className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            발송
          </button>
        </div>
        {broadcastSent && <p className="text-sm text-green-600">공지가 발송되었습니다. (API 연동 후 실제 발송)</p>}
      </section>

      {/* 금칙어 관리 */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">금칙어 관리</h3>
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
            disabled={!newWord.trim()}
            className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            추가
          </button>
        </div>
        <DataTable columns={wordColumns} rows={bannedWords} rowKey={(w) => w.id} emptyMessage="등록된 금칙어가 없습니다" />
      </section>

      {/* 채팅 금지 목록 */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">채팅 금지 현황</h3>
        <DataTable columns={banColumns} rows={dummyChatBans} rowKey={(b) => b.id} emptyMessage="채팅 금지된 유저가 없습니다" />
      </section>
    </div>
  );
}
