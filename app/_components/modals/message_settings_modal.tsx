'use client';

import { updatePostSetting } from '@/app/_apis/posts';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';

interface MessageSettingsModalProps {
    closeModal: () => void;
    postSetting?: PostSetting;
    setPostSetting: Dispatch<SetStateAction<PostSetting | undefined>>;
}

interface FanLevel {
    id: number;
    name: string;
    min_donation: number;
}

interface PostSetting {
    fanLevels: FanLevel[];
    minFanLevel: number | null;
}

export default function MessageSettingsModal({ closeModal, postSetting, setPostSetting }: MessageSettingsModalProps) {
    const [selectedGrade, setSelectedGrade] = useState<number | null>(null);

    // Get fan levels from postSetting and add '제한없음' option
    const getFanLevels = () => {
        const levels = postSetting?.fanLevels || [];
        
        // Sort levels by min_donation in descending order to assign colors by rank
        const sortedLevels = [...levels].sort((a, b) => b.min_donation - a.min_donation);
        
        // Assign colors based on rank (highest donation gets best color)
        const levelsWithColors = sortedLevels.map((level, index) => ({
            id: level.id,
            name: level.name,
            min_donation: level.min_donation,
            color: getColorByRank(index, sortedLevels.length)
        }));

        return [
            ...levelsWithColors,
            { id: -1, name: '제한없음', min_donation: 0, color: 'bg-text-tertiary' }
        ];
    };

    // Helper function to assign colors based on rank (0 = highest rank)
    const getColorByRank = (rank: number, totalLevels: number) => {
        const colors = [
            '#9333EA',         // 1등 - 보라색 (bg-purple-600)
            '#FFC9D5',         // 2등 - 플래티넘 색상 (이미 hex)
            '#CA8A04',         // 3등 - 노란색 (bg-yellow-600)
            '#D1D5DB',         // 4등 - 회색 (bg-gray-300)
            '#6B7280',         // 5등 - 진한 회색 (bg-gray-500)
        ];
        
        // If there are more levels than colors, cycle through colors
        return colors[rank % colors.length];
    };

    // Initialize selected grade based on minFanLevel
    useEffect(() => {
        if (postSetting) {
            if (postSetting.minFanLevel == null) {
                setSelectedGrade(-1); // -1 means no restriction
            }
            else {
                setSelectedGrade(postSetting.minFanLevel);
            }
        }
    }, [postSetting]);

    const handleGradeToggle = (gradeId: number | null) => {
        setSelectedGrade(gradeId);
    };

    const handleApply = async () => {
        try {
            await updatePostSetting(selectedGrade);
            if (postSetting) {
                setPostSetting({
                    ...postSetting,
                    minFanLevel: selectedGrade
                });
            }
        }
        catch(e) {
        }
        console.log('Selected grade ID:', selectedGrade);
        closeModal();
    };

    const handleCancel = () => {
        closeModal();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="flex flex-col max-w-md w-[450px] h-[520px] border rounded-lg border-tableBorder dark:border-tableBorder-dark bg-modalBg dark:bg-modalBg-dark">
                {/* Header */}
                <h2 className="text-lg font-bold mb-2 px-6 pt-5">쪽지 수신 설정</h2>
                
                {/* Content */}
                <div className="w-full h-[340px] pt-5 px-5 rounded-[8px] overflow-auto">
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-textBase dark:text-textBase-dark mb-3">수신 설정 (설정 등급 이상 수신)</h3>
                        {getFanLevels().map((level) => (
                            <div key={level.id || 'unlimited'} className="group relative">
                                <label className={`flex items-center space-x-4 p-3 rounded border transition-all duration-200 cursor-pointer
                                    ${selectedGrade === level.id 
                                        ? 'border-color-darkBlue' 
                                        : 'border-tableBorder dark:border-tableBorder-dark'
                                    }`}>
                                    <input
                                        type="radio"
                                        id={level.id?.toString() || 'unlimited'}
                                        name="grade"
                                        className="w-4 h-4 text-color-darkBlue bg-modalBg dark:bg-modalBg-dark border-tableBorder dark:border-tableBorder-dark"
                                        checked={selectedGrade === level.id}
                                        onChange={() => handleGradeToggle(level.id)}
                                    />
                                    <div className="flex items-center space-x-3 flex-1">
                                        <div 
                                            className={`w-8 h-8 rounded-full flex items-center justify-center ${level.color.startsWith('bg-') ? level.color : ''}`}
                                            style={level.color.startsWith('#') ? { backgroundColor: level.color } : {}}
                                        >
                                            {level.name === '제한없음' ? (
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            ) : (
                                                <span className="text-white text-xs font-bold">
                                                    {level.name.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-textBase dark:text-textBase-dark font-medium">
                                                {level.name}
                                            </span>
                                            <div className="text-xs text-textBase dark:text-textBase-dark opacity-70 mt-0.5">
                                                {level.name === '제한없음' ? '모든 사용자가 쪽지 발송 가능' : `${level.name} 등급 사용자`}
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-row h-[100px] items-center space-x-5 px-5">
                    <button
                        onClick={handleApply}
                        className="w-full p-2 mt-2 rounded bg-primary text-primary-foreground"
                    >
                        적용
                    </button>
                    <button
                        onClick={handleCancel}
                        className="w-full p-2 mt-2 rounded bg-text-secondary dark:bg-text-secondary-dark text-primary-foreground"
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}
