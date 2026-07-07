'use client';

import { useCallback } from 'react';
import { GlobalNoticeMessage, GlobalNoticePayload, Message } from '@/app/_types';

export const useNoticeHandlers = () => {
  const handleGlobalNotice = useCallback((
    payload: GlobalNoticePayload,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  ) => {
    const noticeMessage: GlobalNoticeMessage = {
      type: 'notice',
      message: payload.message,
      sent_at: payload.sent_at,
    };

    setMessages(prevMessages => [...prevMessages, noticeMessage]);
  }, []);

  return {
    handleGlobalNotice,
  };
};
