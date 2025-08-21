'use client';

import { useCallback } from 'react';
import { Message, ChatMessage, Viewer, RoleChangePayload, MyRole } from '@/app/_types';
import { useUserStore } from '@/app/_lib/stores';
import { hasViewerListPermission } from '../utils/rolePermissions';

export const useRoleHandlers = (
  fetchViewersList: () => Promise<void>,
  viewersIntervalRef: React.MutableRefObject<NodeJS.Timeout | null>,
  setCurrentMyRole: React.Dispatch<React.SetStateAction<MyRole>>
) => {
  const { idx: currentUserIdx } = useUserStore();
  
  // viewer list 갱신 시작
  const startViewerListPolling = useCallback(() => {
    if (!viewersIntervalRef.current) {
      viewersIntervalRef.current = setInterval(() => {
        fetchViewersList();
      }, 60000);
    }
  }, [fetchViewersList, viewersIntervalRef]);

  // viewer list 갱신 중지
  const stopViewerListPolling = useCallback(() => {
    if (viewersIntervalRef.current) {
      clearInterval(viewersIntervalRef.current);
      viewersIntervalRef.current = null;
    }
  }, [viewersIntervalRef]);
  
  // 역할 변경 핸들러
  const handleRoleChanged = useCallback((
    payload: RoleChangePayload,
    setViewers: React.Dispatch<React.SetStateAction<Viewer[]>>,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  ) => {
    console.log('Role change received:', payload);
    
    // viewers 목록에서 해당 사용자의 역할과 등급 업데이트
    setViewers(prevViewers => {
      const currentViewers = Array.isArray(prevViewers) ? prevViewers : [];
      return currentViewers.map(viewer => {
        if (viewer.user_idx === payload.user_idx) {
          return { 
            ...viewer, 
            role: payload.to_role,
            grade: payload.to_grade,
            color: payload.to_color
          };
        }
        return viewer;
      });
    });

    // messages에서 해당 사용자의 역할과 색상 업데이트 (ChatMessage만)
    setMessages(prevMessages => {
      return prevMessages.map(message => {
        if (message.type === 'chat' && (message as ChatMessage).user_idx === payload.user_idx) {
          return {
            ...message,
            role: payload.to_role,
            grade: payload.to_grade,
            color: payload.to_color
          } as ChatMessage;
        }
        return message;
      });
    });

    // 현재 사용자의 역할이 변경된 경우
    if (payload.user_idx === currentUserIdx) {
      // myRole 상태 업데이트
      setCurrentMyRole(prevRole => ({
        ...prevRole,
        role: payload.to_role
      }));
      
      // 새로운 role 기반으로 권한 재검증
      const hasPermission = hasViewerListPermission(payload.to_role);
      
      if (hasPermission) {
        // 권한이 있으면 즉시 리스트 가져오고 갱신 시작
        fetchViewersList();
        startViewerListPolling();
      } else {
        // 권한이 없으면 갱신 중지
        stopViewerListPolling();
      }
    }
  }, [currentUserIdx, setCurrentMyRole, startViewerListPolling, stopViewerListPolling, fetchViewersList]);

  return {
    handleRoleChanged,
    startViewerListPolling,
    stopViewerListPolling,
  };
};