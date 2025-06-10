'use client';

import { useState } from 'react';

interface MessageSettingsModalProps {
    closeModal: () => void;
}

export default function MessageSettingsModal({ closeModal }: MessageSettingsModalProps) {
    const [selectedGrade, setSelectedGrade] = useState<string>('');

    const grades = [
        { key: '123123', label: '123123', color: 'bg-pink-500' },
        { key: '다이아', label: '다이아', color: 'bg-gray-600' },
        { key: '골드', label: '골드', color: 'bg-orange-500' },
        { key: '실버', label: '실버', color: 'bg-primary' },
        { key: '브론즈', label: '브론즈', color: 'bg-warning' },
        { key: '제한없음', label: '제한없음', color: 'bg-text-tertiary' },
    ];

    const handleGradeToggle = (gradeKey: string) => {
        setSelectedGrade(gradeKey);
    };

    const handleApply = () => {
        // TODO: 설정을 서버에 저장하는 로직 구현
        console.log('Selected grade:', selectedGrade);
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
                        {grades.map((grade, index) => (
                            <div key={grade.key} className="group relative">
                                <label className={`flex items-center space-x-4 p-3 rounded border transition-all duration-200 cursor-pointer
                                    ${selectedGrade === grade.key 
                                        ? 'border-color-darkBlue' 
                                        : 'border-tableBorder dark:border-tableBorder-dark'
                                    }`}>
                                    <input
                                        type="radio"
                                        id={grade.key}
                                        name="grade"
                                        className="w-4 h-4 text-color-darkBlue bg-modalBg dark:bg-modalBg-dark border-tableBorder dark:border-tableBorder-dark"
                                        checked={selectedGrade === grade.key}
                                        onChange={() => handleGradeToggle(grade.key)}
                                    />
                                    <div className="flex items-center space-x-3 flex-1">
                                        <div className={`w-8 h-8 rounded-full ${grade.color} flex items-center justify-center`}>
                                            {grade.key === '제한없음' ? (
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                                </svg>
                                            ) : (
                                                <span className="text-white text-xs font-bold">
                                                    {grade.label.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-textBase dark:text-textBase-dark font-medium">
                                                {grade.label}
                                            </span>
                                            <div className="text-xs text-textBase dark:text-textBase-dark opacity-70 mt-0.5">
                                                {grade.key === '제한없음' ? '모든 사용자가 쪽지 발송 가능' : `${grade.label} 등급 사용자`}
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
