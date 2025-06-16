'use client';
import React, { useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";

interface ColorPickerProps {
  levelId: number;
  currentColor: string;
  colorPickerOpen: number | null;
  previewColor: string | null;
  previewLevelId: number | null;
  hexInput: string;
  onColorPreview: (levelId: number, color: string) => void;
  onColorConfirm: () => void;
  onClose: () => void;
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
  onClose,
  onCancel,
  onHexInputChange
}) => {
  const hexInputRef = useRef<HTMLInputElement>(null);

  // hexInput 상태가 변경되거나 colorPicker가 열릴 때 포커스 설정
  useEffect(() => {
    if (colorPickerOpen === levelId && hexInputRef.current) {
      hexInputRef.current.focus();
    }
  }, [hexInput, colorPickerOpen, levelId]);

  if (colorPickerOpen !== levelId) return null;

  const displayColor = previewLevelId === levelId && previewColor ? previewColor : currentColor;
  const hasPreview = previewLevelId === levelId && previewColor && previewColor !== currentColor;

  return (
    <div className="absolute z-50 mt-2 p-6 bg-gray-800 border border-gray-600 rounded-xl shadow-xl left-0 top-full">
      <div className="text-lg text-gray-300 mb-5 font-medium">색상 선택</div>
      
      <div className="flex gap-6">
        {/* 색상 선택 영역 */}
        <div className="flex flex-col gap-4">
          {/* react-colorful 색상 선택기 */}
          <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
            <div className="text-sm text-gray-400 mb-3 font-medium">정밀 색상 선택</div>
            <HexColorPicker 
              color={displayColor} 
              onChange={(color) => onColorPreview(levelId, color)}
              style={{ width: '200px', height: '150px' }}
            />
            
            {/* HEX 입력 필드 */}
            <div className="mt-4">
              <label htmlFor="hex-input" className="block text-xs text-gray-400 mb-2 font-medium">HEX 색상 코드</label>
              <div className="flex items-center bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus-within:border-blue-500 transition-colors">
                <span className="text-gray-300 font-mono text-sm mr-1">#</span>
                <input
                  id="hex-input"
                  ref={hexInputRef}
                  type="text"
                  value={hexInput}
                  onChange={onHexInputChange}
                  placeholder="000000"
                  maxLength={6}
                  className="bg-transparent border-none outline-none text-white font-mono text-sm flex-1 uppercase placeholder-gray-500"
                  style={{ fontFamily: 'monospace' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 색상 비교 및 미리보기 영역 */}
        <div className="flex flex-col gap-4 min-w-[200px]">
          {/* 색상 비교 */}
          <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
            <div className="text-sm text-gray-400 mb-3 font-medium">미리보기</div>
            <div className="flex items-center justify-center gap-4">
              {/* 현재 색상 */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">현재</span>
                <button
                  onClick={() => onColorPreview(levelId, currentColor)}
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

          {/* 확인/취소 버튼 */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onColorConfirm}
              disabled={!hasPreview}
              className={`w-full px-5 py-3 text-white text-sm rounded-lg transition-colors font-medium ${
                hasPreview 
                  ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' 
                  : 'bg-gray-600 cursor-not-allowed opacity-50'
              }`}
            >
              적용
            </button>
            <button
              onClick={onCancel}
              className="w-full px-5 py-3 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors font-medium"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
