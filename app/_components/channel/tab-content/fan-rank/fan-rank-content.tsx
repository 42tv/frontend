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
  // 색상 상태 유지를 위한 상태 추가
  const [colorStates, setColorStates] = useState<Record<number, { color: string; hexInput: string }>>({});
  const [isUpdating, setIsUpdating] = useState(false);

  // 팬 등급 데이터 로드
  useEffect(() => {
    loadFanLevels();
  }, []);

  // 색상 선택기 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.color-picker-container')) {
        // 바깥 클릭 시 취소와 같은 동작 수행
        if (colorPickerOpen !== null) {
          const currentLevel = fanLevels.find(level => level.id === colorPickerOpen);
          if (currentLevel) {
            // 원본 색상으로 되돌리기
            setPreviewColor(currentLevel.color);
            setHexInput(currentLevel.color.replace('#', ''));
          }
        }
        setColorPickerOpen(null);
        setPreviewColor(null);
        setPreviewLevelId(null);
      }
    };

    if (colorPickerOpen !== null) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [colorPickerOpen, fanLevels]);

  const loadFanLevels = async () => {
    try {
      setLoading(true);
      const response = await getFanLevels();
      console.log(response);
      setFanLevels(response);
      // 초기 색상 상태 설정
      const initialColorStates: Record<number, { color: string; hexInput: string }> = {};
      response.forEach((level: FanLevel) => {
        initialColorStates[level.id] = {
          color: level.color,
          hexInput: level.color.replace('#', '')
        };
      });
      setColorStates(initialColorStates);
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

  // 색상 선택기 열기/닫기 (개선된 버전)
  const toggleColorPicker = (levelId: number) => {
    const isOpening = colorPickerOpen !== levelId;
    setColorPickerOpen(isOpening ? levelId : null);
    
    if (isOpening) {
      const currentLevel = fanLevels.find(level => level.id === levelId);
      if (currentLevel) {
        // 현재 원본 색상으로 시작
        setPreviewColor(currentLevel.color);
        setPreviewLevelId(levelId);
        setHexInput(currentLevel.color.replace('#', ''));
      }
    } else {
      setPreviewColor(null);
      setPreviewLevelId(null);
      setHexInput('');
    }
  };

  // 색상 미리보기 핸들러 (개선된 버전)
  const handleColorPreview = (levelId: number, newColor: string) => {
    setPreviewColor(newColor);
    setPreviewLevelId(levelId);
    const newHexInput = newColor.replace('#', '');
    setHexInput(newHexInput);
    // 여기서는 colorStates를 업데이트하지 않음 (미리보기만)
  };

  // 색상 변경 확정 핸들러
  const handleColorConfirm = () => {
    if (previewLevelId !== null && previewColor) {
      // colorStates에 적용된 색상 저장
      setColorStates(prev => ({
        ...prev,
        [previewLevelId]: {
          color: previewColor,
          hexInput: previewColor.replace('#', '')
        }
      }));
    }
    setColorPickerOpen(null);
    setPreviewColor(null);
    setPreviewLevelId(null);
  };

  // 색상 변경 취소 핸들러
  const handleColorCancel = () => {
    if (previewLevelId !== null) {
      const currentLevel = fanLevels.find(level => level.id === previewLevelId);
      if (currentLevel) {
        // 원본 색상으로 되돌리기
        setPreviewColor(currentLevel.color);
        setHexInput(currentLevel.color.replace('#', ''));
      }
    }
    setColorPickerOpen(null);
    setPreviewColor(null);
    setPreviewLevelId(null);
  };

  // HEX 입력 핸들러 (개선된 버전)
  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
    if (value.length <= 6) {
      setHexInput(value);
      if (value.length === 6 && previewLevelId !== null) {
        const hexColor = `#${value}`;
        setPreviewColor(hexColor);
        // 여기서도 colorStates는 업데이트하지 않음 (미리보기만)
      }
    }
  };

  // 모든 레벨 일괄 업데이트 함수
  const handleBulkUpdate = async () => {
    if (isUpdating) return;
    
    const confirmation = confirm('모든 팬 등급의 색상과 필요개수를 업데이트하시겠습니까?');
    if (!confirmation) return;

    setIsUpdating(true);
    try {
      // 개별 업데이트 API 호출
      for (const level of fanLevels) {
        const colorState = colorStates[level.id];
        const updateColor = colorState ? colorState.color : level.color;
        
        // 색상이 변경된 경우에만 업데이트
        if (colorState && colorState.color !== level.color) {
          await updateFanLevel(level.id, level.name, level.min_donation, updateColor);
        }
      }
      
      alert('모든 팬 등급이 성공적으로 업데이트되었습니다.');
      await loadFanLevels();
    } catch (err) {
      console.error('일괄 업데이트 실패:', err);
      alert('일괄 업데이트 중 오류가 발생했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  // 후원 금액 기준으로 내림차순 정렬
  const sortedLevels = [...fanLevels].sort((a, b) => b.min_donation - a.min_donation);

  // 변경사항이 있는지 확인
  const hasChanges = fanLevels.some(level => {
    const colorState = colorStates[level.id];
    return colorState && colorState.color !== level.color;
  });

  return (
    <div className="bg-gray-900 dark:bg-gray-900 p-6 rounded-lg border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-xl text-white">팬 등급 관리</h3>
        <button
          onClick={handleBulkUpdate}
          disabled={isUpdating || !hasChanges}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            isUpdating || !hasChanges
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isUpdating ? '업데이트 중...' : '전체 적용'}
        </button>
      </div>

      <div className="space-y-3">
        {/* 기존 등급 목록 */}
        {sortedLevels.map((level, index) => {
          const currentColorState = colorStates[level.id];
          return (
            <FanLevelItem
              key={level.id}
              level={level}
              index={index}
              previewLevelId={previewLevelId}
              previewColor={previewColor}
              colorPickerOpen={colorPickerOpen}
              hexInput={hexInput}
              colorState={currentColorState}
              onToggleColorPicker={toggleColorPicker}
              onColorPreview={handleColorPreview}
              onColorConfirm={handleColorConfirm}
              onColorCancel={handleColorCancel}
              onCloseColorPicker={() => setColorPickerOpen(null)}
              onHexInputChange={handleHexInputChange}
              onUpdate={handleUpdate}
            />
          );
        })}
      </div>

      {sortedLevels.length > 0 && (
        <div className="mt-6 text-sm text-gray-400">
          * 등급은 후원 금액이 높은 순으로 정렬됩니다.<br />
          * 색상 원을 클릭하여 등급별 색상을 변경할 수 있습니다.<br />
          * '전체 적용' 버튼을 클릭하면 모든 변경사항이 서버에 저장됩니다.
        </div>
      )}
    </div>
  );
};
