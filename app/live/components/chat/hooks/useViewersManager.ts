'use client';

import { useCallback, useRef, useEffect } from 'react';
import { getViewersList } from '@/app/_apis/live';
import { Viewer } from '@/app/_types';

export const useViewersManager = (
  broadcasterId: string,
  setViewers: React.Dispatch<React.SetStateAction<Viewer[]>>
) => {
  const viewersIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // API를 통해 시청자 리스트 가져오기
  const fetchViewersList = useCallback(async () => {
    try {
      const response = await getViewersList(broadcasterId);
      console.log(response);
      if (response && response.data) {
        // 백엔드 ViewerInfo는 모든 필드(profile_img, grade, color)를 포함하므로
        // 그대로 Viewer 타입으로 변환 (타입 호환성만 확인)
        const viewers: Viewer[] = response.data.map(viewer => ({
          user_idx: viewer.user_idx,
          user_id: viewer.user_id,
          nickname: viewer.nickname,
          role: viewer.role as 'broadcaster' | 'manager' | 'viewer',
          profile_img: viewer.profile_img,
          grade: viewer.grade,
          color: viewer.color,
        }));
        setViewers(viewers);
        console.log('Viewers list fetched from API:', viewers);
      }
    } catch (error) {
      console.error('Failed to fetch viewers list:', error);
    }
  }, [broadcasterId, setViewers]);

  // 컴포넌트 언마운트 시 인터벌 정리
  useEffect(() => {
    return () => {
      if (viewersIntervalRef.current) {
        clearInterval(viewersIntervalRef.current);
        viewersIntervalRef.current = null;
      }
    };
  }, []);

  return {
    fetchViewersList,
    viewersIntervalRef,
  };
};