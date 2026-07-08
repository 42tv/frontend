import React from 'react';

interface SanctionNoticeProps {
    message?: string | null;
}

const SanctionNotice: React.FC<SanctionNoticeProps> = ({ message }) => {
    return (
        <div className="p-6 rounded-lg bg-background border border-border-primary">
            <div className="flex flex-col items-center justify-center w-full max-w-3xl py-16 px-4 text-center">
                <div className="flex items-center justify-center w-16 h-16 mb-5 rounded-full bg-error-bg dark:bg-error-bg-dark">
                    <svg
                        className="w-8 h-8 text-error dark:text-error-dark"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18.364 5.636a9 9 0 1 0-12.728 12.728 9 9 0 0 0 12.728-12.728Zm0 0L5.636 18.364"
                        />
                    </svg>
                </div>
                <h3 className="mb-2 font-bold text-xl text-text-primary">방송이 제한된 계정입니다</h3>
                <p className="text-sm text-text-secondary">
                    {message ?? '현재 방송 제재중으로 방송 설정을 이용할 수 없습니다.'}
                </p>
                <p className="mt-1 text-sm text-text-secondary">
                    제재 관련 문의는 고객센터를 통해 접수해 주세요.
                </p>
            </div>
        </div>
    );
};

export default SanctionNotice;
