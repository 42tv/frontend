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
      if (response) {
        setViewers(response.viewers);
        console.log('Viewers list fetched from API:', response.viewers);
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