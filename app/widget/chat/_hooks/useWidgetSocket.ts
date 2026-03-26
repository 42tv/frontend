'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatMessage } from '@/app/_types';

const MAX_MESSAGES_HARD_LIMIT = 50;

export type WidgetSocketStatus = 'idle' | 'connecting' | 'connected' | 'error';

export const useWidgetSocket = (token: string, maxMessages: number) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<WidgetSocketStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const socketRef = useRef<Socket | null>(null);
  const maxMessagesRef = useRef(maxMessages);

  useEffect(() => {
    maxMessagesRef.current = maxMessages;
  }, [maxMessages]);

  useEffect(() => {
    if (!token) return;

    setStatus('connecting');

    const socket = io(
      `ws://${process.env.NEXT_PUBLIC_BACKEND}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/overlay`,
      {
        query: { token },
        transports: ['websocket'],
      }
    );

    socketRef.current = socket;

    socket.on('connect', () => setStatus('connected'));
    socket.on('connect_error', () => {
      setStatus('error');
      setErrorMessage('소켓 연결에 실패했습니다');
    });
    socket.on('chat', (data: ChatMessage) => {
      setStatus('connected');
      setMessages((prev) => {
        const next = [...prev, data];
        console.log(next)
        const limit = Math.min(maxMessagesRef.current, MAX_MESSAGES_HARD_LIMIT);
        return next.length > limit ? next.slice(next.length - limit) : next;
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  return { messages, status, errorMessage };
};
