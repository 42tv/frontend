'use client';
import { useEffect } from 'react';

export interface LightboxImage {
  url: string;
  name?: string;
}

interface ImageLightboxProps {
  images: LightboxImage[];
  /** 현재 표시 중인 이미지 인덱스 */
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}

/**
 * 이미지 보기 소형 모달 — AdminModal(z-50) 위에 겹쳐 뜨므로 z-[60] 사용.
 * Escape는 캡처 단계에서 가로채 아래에 열려 있는 모달까지 닫히지 않게 한다.
 */
export default function ImageLightbox({ images, index, onClose, onNavigate }: ImageLightboxProps) {
  const image = images[index];
  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      } else if (e.key === 'ArrowLeft' && index > 0) {
        onNavigate(index - 1);
      } else if (e.key === 'ArrowRight' && index < images.length - 1) {
        onNavigate(index + 1);
      }
    };
    window.addEventListener('keydown', handleKey, { capture: true });
    return () => window.removeEventListener('keydown', handleKey, { capture: true });
  }, [index, images.length, onClose, onNavigate]);

  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="첨부 이미지 보기"
    >
      <div
        className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border">
          <span className="text-sm font-medium text-foreground truncate" title={image.name}>
            {image.name ?? '첨부 이미지'}
          </span>
          <button
            onClick={onClose}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors text-xl leading-none"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        <div className="p-4 flex items-center justify-center bg-muted/30">
          {/* 첨부는 외부(S3) URL이라 next/image 도메인 설정 없이 원본을 그대로 표시 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.url}
            alt={image.name ?? '첨부 이미지'}
            className="max-h-[55vh] max-w-full object-contain rounded-md"
          />
        </div>

        {images.length > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <button
              onClick={() => onNavigate(index - 1)}
              disabled={!hasPrev}
              className="px-3 py-1.5 text-sm rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-40 transition-colors"
            >
              이전
            </button>
            <span className="text-sm text-muted-foreground">
              {index + 1} / {images.length}
            </span>
            <button
              onClick={() => onNavigate(index + 1)}
              disabled={!hasNext}
              className="px-3 py-1.5 text-sm rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-40 transition-colors"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
