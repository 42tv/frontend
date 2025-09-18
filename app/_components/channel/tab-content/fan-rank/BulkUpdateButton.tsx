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
            ? 'bg-bg-tertiary text-text-secondary cursor-not-allowed opacity-60'
            : 'bg-accent text-white hover:bg-accent-light cursor-pointer'
        }`}
      >
        {isUpdating ? '업데이트 중...' : '전체 적용'}
      </button>
    </div>
  );
};
