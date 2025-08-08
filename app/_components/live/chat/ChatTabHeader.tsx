'use client';
import React from 'react';
import { TabType } from '@/app/_types';

interface ChatTabHeaderProps {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
    viewersCount: number;
    canViewManagement: boolean;
}

const ChatTabHeader: React.FC<ChatTabHeaderProps> = ({ 
    activeTab, 
    setActiveTab, 
    viewersCount, 
    canViewManagement 
}) => {
    return (
        <div className="border-b border-border-secondary dark:border-border-secondary-dark">
            <div className="flex">
                <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 p-3 text-center font-semibold transition-colors duration-150 ${
                        activeTab === 'chat' 
                            ? 'bg-bg-tertiary dark:bg-bg-tertiary-dark border-b-2 border-primary' 
                            : 'hover:bg-bg-tertiary dark:hover:bg-bg-tertiary-dark'
                    }`}
                >
                    채팅
                </button>
                {canViewManagement && (
                    <button
                        onClick={() => setActiveTab('viewers')}
                        className={`flex-1 p-3 text-center font-semibold transition-colors duration-150 ${
                            activeTab === 'viewers' 
                                ? 'bg-bg-tertiary dark:bg-bg-tertiary-dark border-b-2 border-primary' 
                                : 'hover:bg-bg-tertiary dark:hover:bg-bg-tertiary-dark'
                        }`}
                    >
                        시청자 ({viewersCount})
                    </button>
                )}
            </div>
        </div>
    );
};

export default ChatTabHeader;
