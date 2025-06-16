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
    <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
      <div className="text-sm text-gray-400 mb-3 font-medium">미리보기</div>
      <div className="flex items-center justify-center gap-4">
        {/* 현재 색상 */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-gray-400 font-medium">현재</span>
          <button
            onClick={onResetToCurrentColor}
            className="w-16 h-16 rounded-xl border-2 border-gray-600 shadow-lg hover:border-gray-400 transition-colors cursor-pointer"
            style={{ backgroundColor: currentColor }}
            title="현재 색상으로 되돌리기"
          />
          <span className="text-xs text-gray-300 font-mono">{currentColor.toUpperCase()}</span>
        </div>
        
        {/* 화살표 */}
        <div className="text-gray-400 text-2xl">→</div>
        
        {/* 새 색상 */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-yellow-400 font-medium">새 색상</span>
          <div 
            className={`w-16 h-16 rounded-xl border-2 shadow-lg ${
              hasPreview ? 'border-yellow-400' : 'border-gray-600'
            }`}
            style={{ backgroundColor: displayColor }}
          />
          <span className={`text-xs font-mono ${
            hasPreview ? 'text-yellow-300' : 'text-gray-300'
          }`}>
            {displayColor.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};
