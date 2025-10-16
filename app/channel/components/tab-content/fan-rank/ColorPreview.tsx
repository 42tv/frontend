'use client';
import React from "react";

interface ColorPreviewProps {
  currentColor: string;
  displayColor: string;
  hasPreview: boolean;
  onResetToCurrentColor: () => void;
}

export const ColorPreview: React.FC<ColorPreviewProps> = ({
  currentColor,
  displayColor,
  hasPreview,
  onResetToCurrentColor
}) => {
  return (
    <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-300)', border: '1px solid var(--bg-300)' }}>
      <div className="text-sm mb-3 font-medium" style={{ color: 'var(--text-200)' }}>미리보기</div>
      <div className="flex items-center justify-center gap-4">
        {/* 현재 색상 */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-medium" style={{ color: 'var(--text-200)' }}>현재</span>
          <button
            onClick={onResetToCurrentColor}
            className="w-16 h-16 rounded-xl border-2 shadow-lg transition-colors cursor-pointer"
            style={{ backgroundColor: currentColor, borderColor: 'var(--bg-300)' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--text-200)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--bg-300)'}
            title="현재 색상으로 되돌리기"
          />
          <span className="text-xs font-mono" style={{ color: 'var(--text-100)' }}>{currentColor.toUpperCase()}</span>
        </div>
        
        {/* 화살표 */}
        <div className="text-2xl" style={{ color: 'var(--text-200)' }}>→</div>
        
        {/* 새 색상 */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-medium" style={{ color: 'var(--accent-100)' }}>새 색상</span>
          <div 
            className="w-16 h-16 rounded-xl border-2 shadow-lg"
            style={{ 
              backgroundColor: displayColor,
              borderColor: hasPreview ? 'var(--accent-100)' : 'var(--bg-300)'
            }}
          />
          <span className="text-xs font-mono" style={{ color: hasPreview ? 'var(--accent-100)' : 'var(--text-100)' }}>
            {displayColor.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};
