'use client';
import React, { useState, useEffect } from "react";
import { FanLevel } from "@/app/_components/utils/interfaces";
import { getFanLevels, updateFanLevel } from "@/app/_apis/user";
import { FanLevelItem } from "./FanLevelItem";

export const FanRankContent = () => {
  const [fanLevels, setFanLevels] = useState<FanLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [colorPickerOpen, setColorPickerOpen] = useState<number | null>(null);
  const [previewColor, setPreviewColor] = useState<string | null>(null);
  const [previewLevelId, setPreviewLevelId] = useState<number | null>(null);
  const [hexInput, setHexInput] = useState<string>('');

  // 팬 등급 데이터 로드
  useEffect(() => {
    loadFanLevels();
  }, []);

  // 색상 선택기 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.color-picker-container')) {
        setColorPickerOpen(null);
      }
    };

    if (colorPickerOpen !== null) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [colorPickerOpen]);

  const loadFanLevels = async () => {
    try {
      setLoading(true);
      const response = await getFanLevels();
      console.log(response);
      setFanLevels(response);
      setError(null);
    } catch (err) {
      console.error('팬 등급 로드 실패:', err);
      setError('팬 등급을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 등급 수정
  const handleUpdate = async (id: number, name?: string, minDonation?: number, color?: string) => {
    const levelToUpdate = fanLevels.find(level => level.id === id);
    if (!levelToUpdate) return;

    const updateName = name !== undefined ? name : levelToUpdate.name;
    const updateMinDonation = minDonation !== undefined ? minDonation : levelToUpdate.min_donation;
    const updateColor = color !== undefined ? color : levelToUpdate.color;

    if (!updateName.trim() || updateMinDonation < 0) {
      alert('등급명과 최소 후원 금액을 올바르게 입력해주세요.');
      return;
    }

    try {
      await updateFanLevel(id, updateName, updateMinDonation, updateColor);
      await loadFanLevels();
    } catch (err) {
      console.error('팬 등급 수정 실패:', err);
      alert('팬 등급 수정에 실패했습니다.');
    }
  };

  // 색상 선택기 열기/닫기
  const toggleColorPicker = (levelId: number) => {
    const isOpening = colorPickerOpen !== levelId;
    setColorPickerOpen(isOpening ? levelId : null);
    setPreviewColor(null);
    setPreviewLevelId(null);
    
    if (isOpening) {
      const currentLevel = fanLevels.find(level => level.id === levelId);
      if (currentLevel) {
        setPreviewColor(currentLevel.color);
        setPreviewLevelId(levelId);
        // HEX 입력값을 현재 색상에서 # 제거한 값으로 설정
        setHexInput(currentLevel.color.replace('#', ''));
      }
    } else {
      setHexInput('');
    }
  };

  // 색상 미리보기 핸들러
  const handleColorPreview = (levelId: number, newColor: string) => {
    setPreviewColor(newColor);
    setPreviewLevelId(levelId);
    // HEX 입력값도 동기화
    setHexInput(newColor.replace('#', ''));
  };

  // 색상 변경 확정 핸들러
  const handleColorConfirm = () => {
    if (previewLevelId !== null && previewColor) {
      handleUpdate(previewLevelId, undefined, undefined, previewColor);
    }
    setColorPickerOpen(null);
    setPreviewColor(null);
    setPreviewLevelId(null);
  };

  // HEX 입력 핸들러
  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
    if (value.length <= 6) {
      setHexInput(value);
      if (value.length === 6 && previewLevelId !== null) {
        const hexColor = `#${value}`;
        setPreviewColor(hexColor);
      }
    }
  };

  // 후원 금액 기준으로 내림차순 정렬
  const sortedLevels = [...fanLevels].sort((a, b) => b.min_donation - a.min_donation);

  return (
    <div className="bg-gray-900 dark:bg-gray-900 p-6 rounded-lg border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-xl text-white">팬 등급 관리</h3>
      </div>

      <div className="space-y-3">
        {/* 기존 등급 목록 */}
        {sortedLevels.map((level, index) => (
          <FanLevelItem
            key={level.id}
            level={level}
            index={index}
            previewLevelId={previewLevelId}
            previewColor={previewColor}
            colorPickerOpen={colorPickerOpen}
            hexInput={hexInput}
            onToggleColorPicker={toggleColorPicker}
            onColorPreview={handleColorPreview}
            onColorConfirm={handleColorConfirm}
            onCloseColorPicker={() => setColorPickerOpen(null)}
            onHexInputChange={handleHexInputChange}
            onUpdate={handleUpdate}
          />
        ))}
      </div>

      {sortedLevels.length > 0 && (
        <div className="mt-6 text-sm text-gray-400">
          * 등급은 후원 금액이 높은 순으로 정렬됩니다.<br />
          * 색상 원을 클릭하여 등급별 색상을 변경할 수 있습니다.
        </div>
      )}
    </div>
  );
};
