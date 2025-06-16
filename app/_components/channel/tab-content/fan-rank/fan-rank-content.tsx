'use client';
import React, { useState, useEffect } from "react";
import { FanLevel } from "@/app/_components/utils/interfaces";
import { getFanLevels, updateFanLevel } from "@/app/_apis/user";
import { FanLevelItem } from "./FanLevelItem";
import { FanRankHeader } from "./FanRankHeader";
import { BulkUpdateButton } from "./BulkUpdateButton";
import errorModalStore from "@/app/_components/utils/store/errorModalStore";
import ErrorMessage from "@/app/_components/modals/error_component";
import DefaultAlertMessage from "@/app/_components/modals/default_alert_compoent";

export const FanRankContent = () => {
  const { openError } = errorModalStore();
  const [fanLevels, setFanLevels] = useState<FanLevel[]>([]);
  const [originalFanLevels, setOriginalFanLevels] = useState<FanLevel[]>([]);
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
          const colorState = colorStates[colorPickerOpen];
          
          if (currentLevel) {
            // 변경된 색상이 있으면 그것으로 되돌리고, 없으면 원본 색상으로 되돌리기
            const resetColor = colorState ? colorState.color : currentLevel.color;
            setPreviewColor(resetColor);
            setHexInput(resetColor.replace('#', ''));
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
  }, [colorPickerOpen, fanLevels, colorStates]);

  const loadFanLevels = async () => {
    try {
      setLoading(true);
      const response = await getFanLevels();
      console.log(response);
      setFanLevels(response);
      setOriginalFanLevels(JSON.parse(JSON.stringify(response))); // 깊은 복사로 원본 저장
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
    } catch (err: any) {
      console.error('팬 등급 로드 실패:', err);
      setError('팬 등급을 불러오는데 실패했습니다.');
      openError(<ErrorMessage message={err?.response?.data?.message || '팬 등급을 불러오는데 실패했습니다.'} />);
    } finally {
      setLoading(false);
    }
  };

  // 등급 수정 (로컬 상태만 업데이트)
  const handleUpdate = (id: number, name?: string, minDonation?: number, color?: string) => {
    const levelToUpdate = fanLevels.find(level => level.id === id);
    if (!levelToUpdate) return;

    const updateName = name !== undefined ? name : levelToUpdate.name;
    const updateMinDonation = minDonation !== undefined ? minDonation : levelToUpdate.min_donation;
    const updateColor = color !== undefined ? color : levelToUpdate.color;

    if (!updateName.trim() || updateMinDonation < 0) {
      openError(<ErrorMessage message="등급명과 최소 후원 금액을 올바르게 입력해주세요." />);
      return;
    }

    // 로컬 상태 업데이트
    setFanLevels(prevLevels => 
      prevLevels.map(level => 
        level.id === id 
          ? { ...level, name: updateName, min_donation: updateMinDonation, color: updateColor }
          : level
      )
    );

    // 색상이 변경된 경우 colorStates도 업데이트
    if (color !== undefined) {
      setColorStates(prev => ({
        ...prev,
        [id]: {
          color: updateColor,
          hexInput: updateColor.replace('#', '')
        }
      }));
    }
  };

  // 색상 선택기 열기/닫기 (개선된 버전)
  const toggleColorPicker = (levelId: number) => {
    const isOpening = colorPickerOpen !== levelId;
    setColorPickerOpen(isOpening ? levelId : null);
    
    if (isOpening) {
      const currentLevel = fanLevels.find(level => level.id === levelId);
      const colorState = colorStates[levelId];
      
      if (currentLevel) {
        // 변경된 색상이 있으면 그것을 사용하고, 없으면 원본 색상 사용
        const startColor = colorState ? colorState.color : currentLevel.color;
        setPreviewColor(startColor);
        setPreviewLevelId(levelId);
        setHexInput(startColor.replace('#', ''));
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
      
      // fanLevels 상태도 업데이트하여 UI에 반영
      setFanLevels(prevLevels => 
        prevLevels.map(level => 
          level.id === previewLevelId 
            ? { ...level, color: previewColor }
            : level
        )
      );
    }
    setColorPickerOpen(null);
    setPreviewColor(null);
    setPreviewLevelId(null);
  };

  // 색상 변경 취소 핸들러
  const handleColorCancel = () => {
    if (previewLevelId !== null) {
      const currentLevel = fanLevels.find(level => level.id === previewLevelId);
      const colorState = colorStates[previewLevelId];
      
      if (currentLevel) {
        // 변경된 색상이 있으면 그것으로 되돌리고, 없으면 원본 색상으로 되돌리기
        const resetColor = colorState ? colorState.color : currentLevel.color;
        setPreviewColor(resetColor);
        setHexInput(resetColor.replace('#', ''));
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

    setIsUpdating(true);
    try {
      // 모든 레벨의 현재 상태를 수집하여 한 번에 업데이트
      const updatedLevels = fanLevels.map(level => {
        const colorState = colorStates[level.id];
        const updateColor = colorState ? colorState.color : level.color;
        return {
          name: level.name,
          min_donation: level.min_donation,
          color: updateColor
        };
      });
      
      // 새로운 API로 모든 레벨 한 번에 업데이트
      await updateFanLevel(updatedLevels);
      await loadFanLevels();
    } catch (err: any) {
      console.error('일괄 업데이트 실패:', err);
      openError(<ErrorMessage message={err?.response?.data?.message || '일괄 업데이트 중 오류가 발생했습니다.'} />);
    } finally {
      setIsUpdating(false);
    }
  };

  // 변경사항이 있는지 확인 (색상 변경 또는 min_donation 변경)
  const hasChanges = fanLevels.some(level => {
    const originalLevel = originalFanLevels.find(orig => orig.id === level.id);
    const colorState = colorStates[level.id];
    
    if (!originalLevel) return false;
    
    // 색상 변경 확인
    const hasColorChange = colorState && colorState.color !== originalLevel.color;
    
    // min_donation 변경 확인
    const hasMinDonationChange = level.min_donation !== originalLevel.min_donation;
    
    // 이름 변경 확인
    const hasNameChange = level.name !== originalLevel.name;
    
    return hasColorChange || hasMinDonationChange || hasNameChange;
  });

  return (
    <div className="bg-gray-900 dark:bg-gray-900 p-6 rounded-lg border border-gray-700">
      <FanRankHeader title="팬 등급 관리" />

      <div className="space-y-3">
        {/* 기존 등급 목록 */}
        {fanLevels.map((level, index) => {
          const currentColorState = colorStates[level.id];
          const originalLevel = originalFanLevels.find(orig => orig.id === level.id);
          return (
            <FanLevelItem
              key={level.id}
              level={level}
              index={index}
              originalColor={originalLevel?.color || level.color}
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
      
      {/* 전체 적용 버튼 */}
      <BulkUpdateButton 
        onBulkUpdate={handleBulkUpdate}
        isUpdating={isUpdating}
        hasChanges={hasChanges}
      />

      {fanLevels.length > 0 && (
        <>
          <div className="mt-6 text-sm text-gray-400">
            * 색상 원을 클릭하여 등급별 색상을 변경할 수 있습니다.<br />
            * '전체 적용' 버튼을 클릭하면 모든 변경사항이 서버에 저장됩니다.
          </div>
        </>
      )}
    </div>
  );
};
