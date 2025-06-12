'use client';
import React, { useState, useEffect } from "react";
import { FanLevel } from "@/app/_components/utils/interfaces";
import { getFanLevels, updateFanLevel } from "@/app/_apis/user";
import { FiSave, FiX } from "react-icons/fi";

export const FanRankContent = () => {
  const [fanLevels, setFanLevels] = useState<FanLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', min_donation: 0 });

  // 팬 등급 데이터 로드
  useEffect(() => {
    loadFanLevels();
  }, []);

  const loadFanLevels = async () => {
    try {
      setLoading(true);
      const response = await getFanLevels();
      console.log(response);
      setFanLevels(response);
      setError(null);
    } catch (err) {
      console.error('팬 등급 로드 실패:', err);
      setError('팬 등급을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 새 등급 생성
  const handleCreate = async () => {
    if (!editForm.name.trim() || editForm.min_donation < 0) {
      alert('등급명과 최소 후원 금액을 올바르게 입력해주세요.');
      return;
    }

    try {
      await loadFanLevels();
      setIsCreating(false);
      setEditForm({ name: '', min_donation: 0 });
    } catch (err) {
      console.error('팬 등급 생성 실패:', err);
      alert('팬 등급 생성에 실패했습니다.');
    }
  };

  // 등급 수정
  const handleUpdate = async (id: number, name?: string, minDonation?: number) => {
    const levelToUpdate = fanLevels.find(level => level.id === id);
    if (!levelToUpdate) return;

    const updateName = name !== undefined ? name : levelToUpdate.name;
    const updateMinDonation = minDonation !== undefined ? minDonation : levelToUpdate.min_donation;

    if (!updateName.trim() || updateMinDonation < 0) {
      alert('등급명과 최소 후원 금액을 올바르게 입력해주세요.');
      return;
    }

    try {
      await updateFanLevel(id, updateName, updateMinDonation);
      await loadFanLevels();
    } catch (err) {
      console.error('팬 등급 수정 실패:', err);
      alert('팬 등급 수정에 실패했습니다.');
    }
  };

  // 새 등급 생성시 취소
  const cancelEdit = () => {
    setIsCreating(false);
    setEditForm({ name: '', min_donation: 0 });
  };

  // 등급 색상 생성 (후원 금액 기준으로 정렬)
  const getGradeColor = (index: number, total: number) => {
    const colors = [
      'bg-gradient-to-br from-purple-500 to-purple-700',    // 1등급 - 보라색 그라데이션
      'bg-gradient-to-br from-blue-500 to-blue-700',       // 2등급 - 파란색 그라데이션
      'bg-gradient-to-br from-green-500 to-green-700',     // 3등급 - 초록색 그라데이션
      'bg-gradient-to-br from-yellow-500 to-yellow-700',   // 4등급 - 노란색 그라데이션
      'bg-gradient-to-br from-gray-500 to-gray-700',       // 5등급 - 회색 그라데이션
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="bg-gray-900 dark:bg-gray-900 p-6 rounded-lg border border-gray-700">
        <div className="text-center text-gray-300">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 dark:bg-gray-900 p-6 rounded-lg border border-gray-700">
        <div className="text-center text-red-400">{error}</div>
        <button 
          onClick={loadFanLevels}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white mx-auto block transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 후원 금액 기준으로 내림차순 정렬
  const sortedLevels = [...fanLevels].sort((a, b) => b.min_donation - a.min_donation);

  return (
    <div className="bg-gray-900 dark:bg-gray-900 p-6 rounded-lg border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-xl text-white">팬 등급 관리</h3>
      </div>

      <div className="space-y-3">
        {/* 기존 등급 목록 */}
        {sortedLevels.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            등록된 팬 등급이 없습니다. 새 등급을 추가해보세요.
          </div>
        ) : (
          sortedLevels.map((level, index) => (
            <div key={level.id} className="bg-gray-800 dark:bg-gray-800 p-4 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors flex items-center gap-4">
              <span className="font-bold text-lg text-white w-8 text-center flex-shrink-0">{index + 1}</span>
              <div className={`w-12 h-12 ${getGradeColor(index, sortedLevels.length)} rounded-full flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0`}>
                {level.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{level.name}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <input
                  type="number"
                  value={level.min_donation}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value) || 0;
                    handleUpdate(level.id, level.name, newValue);
                  }}
                  className="w-24 px-2 py-1 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500 text-center text-white"
                />
              </div>
            </div>
          ))
        )}
      </div>

      {sortedLevels.length > 0 && (
        <div className="mt-6 text-sm text-gray-400">
          * 등급은 후원 금액이 높은 순으로 정렬됩니다.
        </div>
      )}
    </div>
  );
};
