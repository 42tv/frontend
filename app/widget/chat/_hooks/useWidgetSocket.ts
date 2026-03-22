'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatMessage, OpCode } from '@/app/_types';
import { requestPlay } from '@/app/_apis/live';

const MAX_MESSAGES_HARD_LIMIT = 50;

export type WidgetSocketStatus = 'idle' | 'connecting' | 'connected' | 'error';

export const useWidgetSocket = (broadcasterId: string, maxMessages: number) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<WidgetSocketStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const socketRef = useRef<Socket | null>(null);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => {
      const next = [...prev, message];
      const limit = Math.min(maxMessages, MAX_MESSAGES_HARD_LIMIT);
      return next.length > limit ? next.slice(next.length - limit) : next;
    });
  }, [maxMessages]);

  useEffect(() => {
    if (!broadcasterId) return;

    setStatus('connecting');

    async function connect() {
      try {
        const response = await requestPlay(broadcasterId);
        const playToken = response.data.user.play_token;

        const socket = io(
          `ws://${process.env.NEXT_PUBLIC_BACKEND}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/chat`,
          {
            withCredentials: true,
            auth: { token: `Bearer ${playToken}` },
            transports: ['websocket'],
          }
        );

        socketRef.current = socket;

        socket.on('connect', () => setStatus('connected'));
        socket.on('connect_error', () => {
          setStatus('error');
          setErrorMessage('소켓 연결에 실패했습니다');
        });
        socket.on(OpCode.CHAT, (msg: ChatMessage) => addMessage(msg));
      } catch {
        setStatus('error');
        setErrorMessage('방송 정보를 불러올 수 없습니다. 로그인 여부를 확인하세요.');
      }
    }

    connect();

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [broadcasterId, addMessage]);

  return { messages, status, errorMessage };
};
