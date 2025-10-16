import React from 'react';

const NotFoundState: React.FC = () => {
  return (
    <div className="py-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h4 className="text-red-400 font-medium mb-2">사용자를 찾을 수 없습니다</h4>
        <p className="text-red-300 text-sm">입력하신 닉네임을 다시 확인해주세요.</p>
      </div>
    </div>
  );
};

export default NotFoundState;