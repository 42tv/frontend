'use client';

import { updatePostSetting } from '@/app/_apis/posts';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { PostSetting } from '@/app/_components/info/tabs/post_tabs_component/types/message';

interface MessageSettingsModalProps {
    closeModal: () => void;
    postSetting?: PostSetting;
    setPostSetting: Dispatch<SetStateAction<PostSetting | undefined>>;
}

export default function MessageSettingsModal({ closeModal, postSetting, setPostSetting }: MessageSettingsModalProps) {
    const [selectedGrade, setSelectedGrade] = useState<number | null>(null);

    // Get fan levels from postSetting and add '제한없음' option
    const getFanLevels = () => {
        const levels = postSetting?.fanLevels || [];

        // Sort levels by level in descending order (level 1 = highest rank)
        const sortedLevels = [...levels].sort((a, b) => b.level - a.level);
        
        // Use API data directly (level, name, min_donation, color)
        const levelsWithData = sortedLevels.map((level) => ({
            level: level.level,
            name: level.name,
            min_donation: level.min_donation,
            color: level.color
        }));

        return [
            ...levelsWithData,
            { level: 0, name: '제한없음', min_donation: 0, color: 'var(--bg-300)' }
        ];
    };

    // Convert fan level to level number for API
    const getLevelFromSelection = (selectedLevel: number | null): number | null => {
        if (selectedLevel === null || selectedLevel === 0) return null; // 제한없음
        return selectedLevel; // API에서 받은 level 값을 그대로 사용
    };

    // Initialize selected grade based on minFanLevel
    useEffect(() => {
        if (postSetting) {
            if (postSetting.minFanLevel == null) {
                setSelectedGrade(0); // 0 means no restriction
            }
            else {
                // Use minFanLevel directly as it's now the level value
                setSelectedGrade(postSetting.minFanLevel);
            }
        }
    }, [postSetting]);

    const handleGradeToggle = (level: number | null) => {
        setSelectedGrade(level);
    };

    const handleApply = async () => {
        try {
            // Convert level to API format
            const levelValue = getLevelFromSelection(selectedGrade);
            console.log('Selected level:', selectedGrade, 'API Level:', levelValue);
            
            await updatePostSetting(levelValue);
            if (postSetting) {
                setPostSetting({
                    ...postSetting,
                    minFanLevel: levelValue
                });
            }
        }
        catch {
        }
        closeModal();
    };

    const handleCancel = () => {
        closeModal();
    };

    return (
            <div className="flex flex-col max-w-md w-[450px] h-[520px] border rounded-lg border-border-primary bg-bg-secondary">
                {/* Header */}
                <div className="px-6 pt-5 pb-4 bg-background rounded-t-lg">
                    <h2 className="text-lg font-bold text-text-primary">쪽지 수신 설정</h2>
                </div>

                {/* Divider */}
                <div className="border-t border-border-primary"></div>

                {/* Content */}
                <div className="w-full h-[340px] pt-5 px-5 rounded-[8px] overflow-auto bg-bg-secondary">
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-text-primary mb-3">수신 설정 (선택한 등급 이상에서 수신)</h3>
                        {getFanLevels().map((levelData) => (
                            <div key={levelData.level || 'unlimited'} className="group relative">
                                <label className={`flex items-center space-x-4 p-3 rounded border transition-all duration-200 cursor-pointer
                                    ${selectedGrade === levelData.level
                                        ? 'border-accent bg-bg-tertiary'
                                        : 'border-border-primary'
                                    }`}>
                                    <input
                                        type="radio"
                                        id={levelData.level?.toString() || 'unlimited'}
                                        name="grade"
                                        className="w-4 h-4 text-primary bg-bg-secondary border-border-primary" style={{accentColor: 'var(--accent)'}}
                                        checked={selectedGrade === levelData.level}
                                        onChange={() => handleGradeToggle(levelData.level)}
                                    />
                                    <div className="flex items-center space-x-3 flex-1">
                                        <div 
                                            className="w-8 h-8 rounded-full flex items-center justify-center"
                                            style={{ backgroundColor: levelData.color.startsWith('#') ? levelData.color : (levelData.color.startsWith('var(') ? levelData.color : `var(${levelData.color})`) }}
                                        >
                                            {levelData.name === '제한없음' ? (
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            ) : (
                                                <span className="text-white text-xs font-bold">
                                                    {levelData.name.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-text-primary font-medium">
                                                {levelData.name}
                                            </span>
                                            <div className="text-xs text-text-secondary mt-0.5">
                                                {levelData.name === '제한없음' ? '모든 사용자가 쪽지 발송 가능' : `${levelData.name} 등급 사용자`}
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="px-5 py-4 bg-background">
                    <div className="border-t border-border-primary"></div>
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-row h-[100px] items-center space-x-5 px-5 bg-background rounded-b-lg">
                    <button
                        onClick={handleApply}
                        className="w-full p-2 mt-2 rounded bg-accent hover:bg-accent-light text-white transition-colors"
                    >
                        적용
                    </button>
                    <button
                        onClick={handleCancel}
                        className="w-full p-2 mt-2 rounded bg-bg-tertiary hover:bg-background text-text-secondary transition-colors"
                    >
                        취소
                    </button>
                </div>
            </div>
    );
}
