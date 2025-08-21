import { useState, useEffect } from "react";
import { FanLevel } from "@/app/_types";
import { getFanLevels, updateFanLevel } from "@/app/_apis/user";

export const useFanRankState = () => {
    const [fanLevels, setFanLevels] = useState<FanLevel[]>([]);
    const [originalFanLevels, setOriginalFanLevels] = useState<FanLevel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [colorStates, setColorStates] = useState<Record<number, { color: string; hexInput: string }>>({});
    const [isUpdating, setIsUpdating] = useState(false);

    // 팬 등급 데이터 로드
    useEffect(() => {
        loadFanLevels();
    }, []);

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
        } catch (err: unknown) {
            console.error('팬 등급 로드 실패:', err);
            setError('팬 등급을 불러오는데 실패했습니다.');
            return { error: err };
        } finally {
            setLoading(false);
        }
    };

    // 등급 수정 (로컬 상태만 업데이트)
    const handleUpdate = (id: number, name?: string, minDonation?: number, color?: string) => {
        const levelToUpdate = fanLevels.find(level => level.id === id);
        if (!levelToUpdate) return { error: "등급을 찾을 수 없습니다." };

        const updateName = name !== undefined ? name : levelToUpdate.name;
        const updateMinDonation = minDonation !== undefined ? minDonation : levelToUpdate.min_donation;
        const updateColor = color !== undefined ? color : levelToUpdate.color;

        if (!updateName.trim() || updateMinDonation < 0) {
            return { error: "등급명과 최소 후원 금액을 올바르게 입력해주세요." };
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

        return { success: true };
    };

    // 모든 레벨 일괄 업데이트 함수
    const handleBulkUpdate = async () => {
        if (isUpdating) return { error: "이미 업데이트 중입니다." };

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
            return { success: true };
        } catch (err: unknown) {
            console.error('일괄 업데이트 실패:', err);
            return { error: err };
        } finally {
            setIsUpdating(false);
        }
    };

    // 변경사항이 있는지 확인
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

    return {
        fanLevels,
        originalFanLevels,
        loading,
        error,
        colorStates,
        isUpdating,
        hasChanges,
        setFanLevels,
        setColorStates,
        handleUpdate,
        handleBulkUpdate,
        loadFanLevels
    };
};