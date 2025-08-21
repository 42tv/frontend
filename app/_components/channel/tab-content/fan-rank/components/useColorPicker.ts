import { useState, useEffect } from "react";
import { FanLevel } from "@/app/_types";

interface UseColorPickerProps {
    fanLevels: FanLevel[];
    colorStates: Record<number, { color: string; hexInput: string }>;
    setFanLevels: React.Dispatch<React.SetStateAction<FanLevel[]>>;
    setColorStates: React.Dispatch<React.SetStateAction<Record<number, { color: string; hexInput: string }>>>;
}

export const useColorPicker = ({ fanLevels, colorStates, setFanLevels, setColorStates }: UseColorPickerProps) => {
    const [colorPickerOpen, setColorPickerOpen] = useState<number | null>(null);
    const [previewColor, setPreviewColor] = useState<string | null>(null);
    const [previewLevelId, setPreviewLevelId] = useState<number | null>(null);
    const [hexInput, setHexInput] = useState<string>('');

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

    // 색상 선택기 열기/닫기
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

    // 색상 미리보기 핸들러
    const handleColorPreview = (levelId: number, newColor: string) => {
        setPreviewColor(newColor);
        setPreviewLevelId(levelId);
        const newHexInput = newColor.replace('#', '');
        setHexInput(newHexInput);
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

    return {
        colorPickerOpen,
        previewColor,
        previewLevelId,
        hexInput,
        setColorPickerOpen,
        toggleColorPicker,
        handleColorPreview,
        handleColorConfirm,
        handleColorCancel,
        handleHexInputChange
    };
};