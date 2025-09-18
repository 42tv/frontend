import React from 'react';

interface TabNavigationProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="flex border-b border-border-primary mb-4">
            <button
                className={`flex-1 py-2 text-center font-medium transition-colors ${
                    activeTab === 'login'
                        ? 'border-b-2 border-accent text-text-primary'
                        : 'text-text-secondary hover:text-text-primary'
                }`}
                onClick={() => onTabChange('login')}
            >
                로그인
            </button>
            <button
                className={`flex-1 py-2 text-center font-medium transition-colors ${
                    activeTab === 'signup'
                        ? 'border-b-2 border-accent text-text-primary'
                        : 'text-text-secondary hover:text-text-primary'
                }`}
                onClick={() => onTabChange('signup')}
            >
                회원가입
            </button>
        </div>
    );
};

export default TabNavigation;