'use client';
import { useState } from 'react';

interface MaskedFieldProps {
  label: string;
  /** 마스킹된 표시 값 (백엔드가 마스킹해서 내려준 값 그대로) */
  value: string;
  /** 열람 시 감사 로그에 기록될 필드 식별자 */
  fieldName: string;
  /** 열람 사유 입력 시 호출 — 원문 값을 반환하는 백엔드 열람 API 연동 지점 */
  onReveal?: (fieldName: string, reason: string) => Promise<string | null>;
}

/**
 * 개인정보 마스킹 필드 (§16-1).
 * 기본 마스킹 표시, 열람 버튼 클릭 시 사유 입력 후 원문 조회 + 열람 로그 기록.
 */
export default function MaskedField({ label, value, fieldName, onReveal }: MaskedFieldProps) {
  const [revealedValue, setRevealedValue] = useState<string | null>(null);
  const [askingReason, setAskingReason] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async (): Promise<void> => {
    if (!reason.trim() || !onReveal || loading) return;
    setLoading(true);
    setError('');
    try {
      const original = await onReveal(fieldName, reason.trim());
      setRevealedValue(original ?? '-');
      setAskingReason(false);
    } catch {
      setError('원문 열람에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-1">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="flex items-center gap-2">
        <span className="font-medium text-foreground">
          {revealedValue ?? value}
        </span>
        {revealedValue === null && !askingReason && (
          <button
            onClick={() => setAskingReason(true)}
            className="text-xs px-2 py-1 rounded border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            열람
          </button>
        )}
      </div>
      {askingReason && (
        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
            placeholder="열람 사유 입력 (감사 로그에 기록됩니다)"
            className="flex-1 px-2 py-1 text-sm rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            autoFocus
          />
          <button
            onClick={handleConfirm}
            disabled={!reason.trim() || loading}
            className="text-xs px-3 py-1.5 rounded bg-primary text-primary-foreground disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {loading ? '조회 중...' : '확인'}
          </button>
          <button
            onClick={() => { setAskingReason(false); setError(''); }}
            className="text-xs px-2 py-1.5 rounded text-muted-foreground hover:text-foreground"
          >
            취소
          </button>
        </div>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
