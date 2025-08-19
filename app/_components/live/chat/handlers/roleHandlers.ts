'use client';

import { useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { Message, ChatMessage, Viewer, RoleChangePayload } from '@/app/_types';

export const useRoleHandlers = (
  socket: Socket | null,
  broadcasterId: string,
  fetchViewersList: () => Promise<void>,
  viewersIntervalRef: React.MutableRefObject<NodeJS.Timeout | null>
) => {
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

    // 매니저로 승격되었을 때 추가 동작
    if (payload.to_role === 'manager') {
      fetchViewersList();
      
      if (!viewersIntervalRef.current) {
        viewersIntervalRef.current = setInterval(() => {
          fetchViewersList();
        }, 60000);
      }
      
      if (socket) {
        socket.emit('get_viewers_list', { broadcasterId });
      }
    } else if (payload.from_role === 'manager') {
      // 매니저에서 다른 역할로 변경되었을 때 갱신 중지
      if (viewersIntervalRef.current) {
        clearInterval(viewersIntervalRef.current);
        viewersIntervalRef.current = null;
      }
    }
  }, [socket, broadcasterId, fetchViewersList, viewersIntervalRef]);

  return {
    handleRoleChanged,
  };
};