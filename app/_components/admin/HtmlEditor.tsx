'use client';
import { useState } from 'react';

interface HtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function HtmlEditor({ value, onChange, placeholder, className }: HtmlEditorProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  return (
    <div className={`border border-border rounded-lg overflow-hidden ${className}`}>
      {/* 에디터 헤더 */}
      <div className="bg-muted border-b border-border px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">HTML 에디터</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              isPreviewMode
                ? 'bg-accent text-accent-foreground'
                : 'bg-background text-foreground hover:bg-accent/50'
            }`}
          >
            {isPreviewMode ? '편집 모드' : '미리보기 모드'}
          </button>
        </div>
      </div>
      
      {/* 에디터 내용 */}
      <div className="relative">
        {isPreviewMode ? (
          <div className="min-h-96 p-4 bg-background">
            <div
              className="policy-document"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          </div>
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-96 p-4 bg-background text-foreground resize-none font-mono text-sm border-none outline-none"
          />
        )}
      </div>
      
      {/* 도움말 */}
      {!isPreviewMode && (
        <div className="bg-muted border-t border-border px-4 py-2">
          <p className="text-xs text-muted-foreground">
            HTML 태그를 사용하여 내용을 작성하세요. 미리보기 모드에서 실제 렌더링 결과를 확인할 수 있습니다.
          </p>
        </div>
      )}
    </div>
  );
}