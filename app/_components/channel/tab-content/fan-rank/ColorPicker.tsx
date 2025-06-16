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
