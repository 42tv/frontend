'use client';

import { useCallback } from 'react';
import { Viewer } from '@/app/_types';

export const useViewerHandlers = () => {
  // 시청자 목록 업데이트 핸들러
  const handleViewersUpdate = useCallback((
    viewersData: Viewer[], 
    setViewers: React.Dispatch<React.SetStateAction<Viewer[]>>
  ) => {
    console.log(viewersData);
    setViewers(viewersData);
  }, []);

  // 시청자 입장 핸들러
  const handleViewerJoin = useCallback((
    viewerData: Viewer,
    setViewers: React.Dispatch<React.SetStateAction<Viewer[]>>
  ) => {
    setViewers(prevViewers => {
      // prevViewers가 배열이 아닌 경우 빈 배열로 초기화
      const currentViewers = Array.isArray(prevViewers) ? prevViewers : [];
      // 중복 방지를 위해 기존에 있는지 확인
      const exists = currentViewers.some(viewer => viewer.user_idx === viewerData.user_idx);
      if (!exists) {
        return [...currentViewers, viewerData];
      }
      return currentViewers;
    });
  }, []);

  // 시청자 퇴장 핸들러
  const handleViewerLeave = useCallback((
    viewerData: { user_idx: number },
    setViewers: React.Dispatch<React.SetStateAction<Viewer[]>>
  ) => {
    setViewers(prevViewers => {
      // prevViewers가 배열이 아닌 경우 빈 배열로 초기화
      const currentViewers = Array.isArray(prevViewers) ? prevViewers : [];
      return currentViewers.filter(viewer => viewer.user_idx !== viewerData.user_idx);
    });
  }, []);

  return {
    handleViewersUpdate,
    handleViewerJoin,
    handleViewerLeave,
  };
};