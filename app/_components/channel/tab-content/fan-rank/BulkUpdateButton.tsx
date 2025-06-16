'use client';
import React from "react";

interface BulkUpdateButtonProps {
  onBulkUpdate: () => void;
  isUpdating: boolean;
  hasChanges: boolean;
}

export const BulkUpdateButton: React.FC<BulkUpdateButtonProps> = ({
  onBulkUpdate,
  isUpdating,
  hasChanges
}) => {
  return (
    <div className="mt-6 flex justify-center">
      <button
        onClick={onBulkUpdate}
        disabled={isUpdating || !hasChanges}
        className={`px-6 py-3 rounded-lg font-medium text-sm transition-colors ${
          isUpdating || !hasChanges
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
        }`}
      >
        {isUpdating ? '업데이트 중...' : '전체 적용'}
      </button>
    </div>
  );
};
