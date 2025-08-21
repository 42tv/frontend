'use client';

import { useCallback } from 'react';
import { RecommendMessage, Message } from '@/app/_types';

export const useRecommendHandlers = () => {
  const handleRecommend = useCallback((
    payload: { nickname: string },
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  ) => {
    console.log('Recommend received:', payload);
    
    const recommendMessage: RecommendMessage = {
      type: 'recommend',
      nickname: payload.nickname,
    };
    
    setMessages(prevMessages => [...prevMessages, recommendMessage]);
  }, []);

  return {
    handleRecommend,
  };
};