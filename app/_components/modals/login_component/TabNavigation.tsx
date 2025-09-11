import React from 'react';

interface TabNavigationProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="flex border-b border-bg-300 mb-4">
            <button
                className={`flex-1 py-2 text-center font-medium ${
                    activeTab === 'login'
                        ? 'border-b-2 border-primary-100 text-text-100'
                        : 'text-text-200 hover:text-text-100'
                }`}
                onClick={() => onTabChange('login')}
            >
                로그인
            </button>
            <button
                className={`flex-1 py-2 text-center font-medium ${
                    activeTab === 'signup'
                        ? 'border-b-2 border-primary-100 text-text-100'
                        : 'text-text-200 hover:text-text-100'
                }`}
                onClick={() => onTabChange('signup')}
            >
                회원가입
            </button>
        </div>
    );
};

export default TabNavigation;