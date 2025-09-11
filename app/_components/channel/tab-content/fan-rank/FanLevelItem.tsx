'use client';
import React, { useState } from "react";
import { FanLevel } from "@/app/_types";
import { ColorPicker } from "./ColorPicker";

interface FanLevelItemProps {
  level: FanLevel;
  index: number;
  originalColor: string;
  previewLevelId: number | null;
  previewColor: string | null;
  colorPickerOpen: number | null;
  hexInput: string;
  colorState?: { color: string; hexInput: string };
  onToggleColorPicker: (levelId: number) => void;
  onColorPreview: (levelId: number, color: string) => void;
  onColorConfirm: () => void;
  onColorCancel: () => void;
  onCloseColorPicker: () => void;
  onHexInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdate: (id: number, name?: string, minDonation?: number, color?: string) => void;
}

export const FanLevelItem: React.FC<FanLevelItemProps> = ({
  level,
  index,
  originalColor,
  previewLevelId,
  previewColor,
  colorPickerOpen,
  hexInput,
  colorState,
  onToggleColorPicker,
  onColorPreview,
  onColorConfirm,
  onCloseColorPicker,
  onHexInputChange,
  onUpdate
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(level.name);

  // 현재 표시할 색상 결정 (우선순위: 미리보기 > 색상 상태 > 원본 색상)
  const displayColor = previewLevelId === level.id && previewColor 
    ? previewColor 
    : (colorState ? colorState.color : level.color);

  // 색상이 원본과 다른지 확인 (원본 색상과 비교)
  const hasColorChange = colorState && colorState.color !== originalColor;

  // 이름 편집 시작
  const handleNameEdit = () => {
    setIsEditingName(true);
    setTempName(level.name);
  };

  // 이름 편집 취소
  const handleNameCancel = () => {
    setIsEditingName(false);
    setTempName(level.name);
  };

  // 이름 편집 완료
  const handleNameSave = () => {
    if (tempName.trim()) {
      onUpdate(level.id, tempName.trim());
      setIsEditingName(false);
    } else {
      handleNameCancel();
    }
  };

  // Enter 키 또는 Escape 키 처리
  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      handleNameCancel();
    }
  };

  return (
    <div className="p-4 rounded-lg transition-colors flex items-center gap-4 relative" style={{ backgroundColor: 'var(--bg-300)', border: '1px solid var(--bg-300)' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--bg-200)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--bg-300)'}>
      <span className="font-bold text-lg w-8 text-center flex-shrink-0" style={{ color: 'var(--text-100)' }}>{index + 1}</span>
      <div className="relative color-picker-container">
        <button
          onClick={() => onToggleColorPicker(level.id)}
          className="w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg flex-shrink-0 hover:scale-105 transition-transform cursor-pointer border-2"
          style={{ 
            backgroundColor: displayColor, 
            color: 'var(--text-100)',
            borderColor: previewLevelId === level.id && previewColor 
              ? 'var(--accent-100)' 
              : hasColorChange 
                ? 'var(--primary-200)' 
                : 'transparent'
          }}
          onMouseEnter={(e) => {
            if (!(previewLevelId === level.id && previewColor) && !hasColorChange) {
              e.currentTarget.style.borderColor = 'var(--text-200)';
            }
          }}
          onMouseLeave={(e) => {
            if (!(previewLevelId === level.id && previewColor) && !hasColorChange) {
              e.currentTarget.style.borderColor = 'transparent';
            }
          }}
          title="색상 변경하기"
        >
          {level.name.charAt(0).toUpperCase()}
        </button>
        <ColorPicker 
          levelId={level.id}
          currentColor={level.color}
          colorPickerOpen={colorPickerOpen}
          previewColor={previewColor}
          previewLevelId={previewLevelId}
          hexInput={hexInput}
          onColorPreview={onColorPreview}
          onColorConfirm={onColorConfirm}
          onCancel={onCloseColorPicker}
          onHexInputChange={onHexInputChange}
        />
      </div>
      <div className="flex-1 min-w-0">
        {isEditingName ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={handleNameKeyDown}
              onBlur={handleNameSave}
              className="flex-1 px-2 py-1 rounded focus:outline-none"
              style={{
                backgroundColor: 'var(--bg-100)',
                border: '1px solid var(--bg-300)',
                color: 'var(--text-100)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary-100)'}
              onBlur={(e) => { e.target.style.borderColor = 'var(--bg-300)'; handleNameSave(); }}
              autoFocus
              maxLength={20}
            />
            <button
              onClick={handleNameSave}
              className="px-2 py-1 rounded text-xs transition-colors"
              style={{ backgroundColor: 'var(--primary-100)', color: 'var(--text-100)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-200)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-100)'}
              title="저장"
            >
              ✓
            </button>
            <button
              onClick={handleNameCancel}
              className="px-2 py-1 rounded text-xs transition-colors"
              style={{ backgroundColor: 'var(--bg-200)', color: 'var(--text-100)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-100)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-200)'}
              title="취소"
            >
              ✕
            </button>
          </div>
        ) : (
          <p 
            className="font-medium truncate cursor-pointer transition-colors"
            style={{ color: 'var(--text-100)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-100)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-100)'}
            onClick={handleNameEdit}
            title="클릭하여 이름 편집"
          >
            {level.name}
            {previewLevelId === level.id && previewColor && (
              <span className="ml-2 text-xs" style={{ color: 'var(--accent-100)' }}>(미리보기)</span>
            )}
            {hasColorChange && previewLevelId !== level.id && (
              <span className="ml-2 text-xs" style={{ color: 'var(--primary-200)' }}>(변경됨)</span>
            )}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <input
          type="text"
          value={level.min_donation}
          onChange={(e) => {
            // 입력값에서 숫자만 추출
            const numbersOnly = e.target.value.replace(/\D/g, '');
            const newValue = parseInt(numbersOnly) || 0;
            onUpdate(level.id, level.name, newValue);
          }}
          className="w-24 px-2 py-1 rounded focus:outline-none text-center"
          style={{
            backgroundColor: 'var(--bg-100)',
            border: '1px solid var(--bg-300)',
            color: 'var(--text-100)'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--primary-100)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--bg-300)'}
        />
      </div>
    </div>
  );
};
