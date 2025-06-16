"use client";

import React, { useState } from "react";
import { BlacklistUser } from "./BlacklistManager";

interface BlacklistAdvancedActionsProps {
  users: BlacklistUser[];
  onBulkAction: (action: string, userIds: string[]) => Promise<void>;
  isLoading: boolean;
}

export const BlacklistAdvancedActions: React.FC<BlacklistAdvancedActionsProps> = ({
  users,
  onBulkAction,
  isLoading,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");

  const handleExport = () => {
    if (exportFormat === "csv") {
      exportToCSV();
    } else {
      exportToJSON();
    }
  };

  const exportToCSV = () => {
    const headers = ["사용자ID", "닉네임", "차단일"];
    const csvContent = [
      headers.join(","),
      ...users.map(user => [
        user.user_id,
        user.nickname || "",
        new Date(user.blocked_at).toLocaleDateString('ko-KR')
      ].join(","))
    ].join("\n");

    downloadFile(csvContent, "blacklist.csv", "text/csv");
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(users, null, 2);
    downloadFile(jsonContent, "blacklist.json", "application/json");
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearOldEntries = async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const oldUserIds = users
      .filter(user => new Date(user.blocked_at) < thirtyDaysAgo)
      .map(user => user.user_id);

    if (oldUserIds.length === 0) {
      alert("30일 이상 된 차단 기록이 없습니다.");
      return;
    }

    if (confirm(`30일 이상 된 ${oldUserIds.length}명의 차단을 해제하시겠습니까?`)) {
      await onBulkAction("remove", oldUserIds);
    }
  };

  return (
    <div className="bg-bg-secondary dark:bg-bg-secondary-dark rounded-lg border border-gray-700">
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-bg-hover dark:hover:bg-bg-hover-dark transition-colors"
      >
        <span className="text-white font-medium">고급 관리 옵션</span>
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showAdvanced && (
        <div className="border-t border-gray-700 p-4 space-y-4">
          {/* 데이터 내보내기 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className="text-gray-400 text-sm min-w-[100px]">데이터 내보내기:</span>
            <div className="flex items-center gap-2">
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as "csv" | "json")}
                className="bg-bg-tertiary dark:bg-bg-tertiary-dark text-white px-3 py-1 rounded border border-gray-600 text-sm"
              >
                <option value="csv">CSV 파일</option>
                <option value="json">JSON 파일</option>
              </select>
              <button
                onClick={handleExport}
                disabled={users.length === 0}
                className="px-4 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded text-sm transition-colors"
              >
                내보내기
              </button>
            </div>
          </div>

          {/* 오래된 기록 정리 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className="text-gray-400 text-sm min-w-[100px]">자동 정리:</span>
            <button
              onClick={handleClearOldEntries}
              disabled={isLoading}
              className="px-4 py-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white rounded text-sm transition-colors"
            >
              30일 이상 된 기록 정리
            </button>
          </div>

          {/* 통계 정보 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-gray-700">
            <div className="text-center">
              <p className="text-lg font-semibold text-white">{users.length}</p>
              <p className="text-xs text-gray-400">총 차단</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-white">
                {users.filter(user => {
                  const blockedDate = new Date(user.blocked_at);
                  const today = new Date();
                  const diffTime = Math.abs(today.getTime() - blockedDate.getTime());
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays <= 7;
                }).length}
              </p>
              <p className="text-xs text-gray-400">최근 7일</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-white">
                {users.filter(user => {
                  const blockedDate = new Date(user.blocked_at);
                  const today = new Date();
                  const diffTime = Math.abs(today.getTime() - blockedDate.getTime());
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays <= 30;
                }).length}
              </p>
              <p className="text-xs text-gray-400">최근 30일</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-white">
                {users.filter(user => {
                  const blockedDate = new Date(user.blocked_at);
                  const thirtyDaysAgo = new Date();
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                  return blockedDate < thirtyDaysAgo;
                }).length}
              </p>
              <p className="text-xs text-gray-400">30일 이상</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
