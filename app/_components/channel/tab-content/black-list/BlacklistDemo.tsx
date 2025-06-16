"use client";

import React from "react";
import { BlacklistManager } from "./BlacklistManager";

/**
 * BlacklistDemo 컴포넌트
 * 
 * 이 컴포넌트는 BlacklistManager를 사용하는 방법을 보여주는 데모입니다.
 * 실제 페이지에서는 BlacklistManager 컴포넌트를 직접 사용하면 됩니다.
 * 
 * 사용법:
 * import { BlacklistManager } from '@/app/_components/channel/tab-content/black-list';
 * 
 * function MyPage() {
 *   return (
 *     <div>
 *       <BlacklistManager />
 *     </div>
 *   );
 * }
 */
export const BlacklistDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">블랙리스트 관리</h1>
          <p className="text-gray-400">차단된 사용자를 효율적으로 관리할 수 있습니다.</p>
        </div>
        
        <BlacklistManager />
        
        <div className="mt-8 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
          <h3 className="text-lg font-medium text-blue-400 mb-2">주요 기능</h3>
          <ul className="text-blue-200 text-sm space-y-1">
            <li>• 사용자 ID로 새로운 사용자 차단</li>
            <li>• 닉네임 또는 ID로 검색</li>
            <li>• 다중 선택을 통한 일괄 해제</li>
            <li>• 닉네임/차단일 기준 정렬</li>
            <li>• CSV/JSON 형태로 데이터 내보내기</li>
            <li>• 30일 이상 된 기록 자동 정리</li>
            <li>• 실시간 통계 정보 제공</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
