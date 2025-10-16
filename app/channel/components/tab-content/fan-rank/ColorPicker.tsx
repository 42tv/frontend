'use client';
import React from "react";
import { HexColorPicker } from "react-colorful";
import { ColorPreview } from "./ColorPreview";
import { HexInputField } from "./HexInputField";

interface ColorPickerProps {
  levelId: number;
  currentColor: string;
  colorPickerOpen: number | null;
  previewColor: string | null;
  previewLevelId: number | null;
  hexInput: string;
  onColorPreview: (levelId: number, color: string) => void;
  onColorConfirm: () => void;
  onCancel: () => void;
  onHexInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  levelId,
  currentColor,
  colorPickerOpen,
  previewColor,
  previewLevelId,
  hexInput,
  onColorPreview,
  onColorConfirm,
  onCancel,
  onHexInputChange
}) => {
  if (colorPickerOpen !== levelId) return null;

  const displayColor = previewLevelId === levelId && previewColor ? previewColor : currentColor;
  const hasPreview = previewLevelId === levelId && previewColor && previewColor !== currentColor;

  return (
    <div className="absolute z-50 mt-2 p-6 rounded-xl shadow-xl left-0 top-full" style={{ backgroundColor: 'var(--bg-200)', border: '1px solid var(--bg-300)' }}>
      <div className="text-lg mb-5 font-medium" style={{ color: 'var(--text-100)' }}>색상 선택</div>
      
      <div className="flex gap-6">
        {/* 색상 선택 영역 */}
        <div className="flex flex-col gap-4">
          {/* react-colorful 색상 선택기 */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-300)', border: '1px solid var(--bg-300)' }}>
            <div className="text-sm mb-3 font-medium" style={{ color: 'var(--text-200)' }}>정밀 색상 선택</div>
            <HexColorPicker 
              color={displayColor} 
              onChange={(color) => onColorPreview(levelId, color)}
              style={{ width: '200px', height: '150px' }}
            />
            
            {/* HEX 입력 필드 */}
            <HexInputField 
              hexInput={hexInput}
              onHexInputChange={onHexInputChange}
              isOpen={colorPickerOpen === levelId}
            />
          </div>
        </div>

        {/* 색상 비교 및 미리보기 영역 */}
        <div className="flex flex-col gap-4 min-w-[200px]">
          {/* 색상 비교 */}
          <ColorPreview 
            currentColor={currentColor}
            displayColor={displayColor}
            hasPreview={!!hasPreview}
            onResetToCurrentColor={() => onColorPreview(levelId, currentColor)}
          />

          {/* 확인/취소 버튼 */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onColorConfirm}
              disabled={!hasPreview}
              className="w-full px-5 py-3 text-sm rounded-lg transition-colors font-medium"
              style={{
                backgroundColor: hasPreview ? 'var(--primary-100)' : 'var(--bg-300)',
                color: 'var(--text-100)',
                cursor: hasPreview ? 'pointer' : 'not-allowed',
                opacity: hasPreview ? 1 : 0.5
              }}
              onMouseEnter={(e) => {
                if (hasPreview) {
                  e.currentTarget.style.backgroundColor = 'var(--accent-100)';
                }
              }}
              onMouseLeave={(e) => {
                if (hasPreview) {
                  e.currentTarget.style.backgroundColor = 'var(--primary-100)';
                }
              }}
            >
              적용
            </button>
            <button
              onClick={onCancel}
              className="w-full px-5 py-3 text-sm rounded-lg transition-colors font-medium"
              style={{ backgroundColor: 'var(--bg-300)', color: 'var(--text-100)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-100)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-300)'}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
