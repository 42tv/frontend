'use client';

import { useCallback } from 'react';
import { ChatMessage, Message } from '@/app/_types';

export const useChatHandlers = () => {
  // 채팅 메시지 핸들러
  const handleChatMessage = useCallback((
    message: ChatMessage, 
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  ) => {
    console.log('Chat message received:', message);
    setMessages(prevMessages => [...prevMessages, message]);
  }, []);

  return {
    handleChatMessage,
  };
};