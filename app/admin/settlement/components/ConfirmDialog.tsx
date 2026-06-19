'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmDialogProps {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  tone?: 'default' | 'danger';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title = '확인',
  message,
  confirmText = '확인',
  cancelText = '취소',
  tone = 'default',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const confirmCls =
    tone === 'danger'
      ? 'bg-red-500 text-white hover:bg-red-600'
      : 'bg-primary text-primary-foreground hover:bg-primary/90';

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60"
      onClick={() => !loading && onCancel()}
    >
      <div
        className="bg-bg-secondary border border-border-primary rounded-xl shadow-2xl w-full max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 className="text-lg font-bold text-text-primary">{title}</h3>
          <p className="mt-2 text-sm text-text-secondary whitespace-pre-line">{message}</p>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-border-primary">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-border-primary text-sm text-text-secondary hover:bg-bg-tertiary disabled:opacity-40 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-40 transition-colors ${confirmCls}`}
          >
            {loading ? '처리 중...' : confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
