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
        className="px-6 py-3 rounded-lg font-medium text-sm transition-colors"
        style={{
          backgroundColor: isUpdating || !hasChanges ? 'var(--bg-300)' : 'var(--primary-100)',
          color: isUpdating || !hasChanges ? 'var(--text-200)' : 'var(--text-100)',
          cursor: isUpdating || !hasChanges ? 'not-allowed' : 'pointer',
          opacity: isUpdating || !hasChanges ? 0.6 : 1
        }}
        onMouseEnter={(e) => {
          if (!isUpdating && hasChanges) {
            e.currentTarget.style.backgroundColor = 'var(--accent-100)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isUpdating && hasChanges) {
            e.currentTarget.style.backgroundColor = 'var(--primary-100)';
          }
        }}
      >
        {isUpdating ? '업데이트 중...' : '전체 적용'}
      </button>
    </div>
  );
};
