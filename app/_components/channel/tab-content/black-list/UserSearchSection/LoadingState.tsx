import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-300 text-sm">사용자 검색 중...</p>
      </div>
    </div>
  );
};

export default LoadingState;