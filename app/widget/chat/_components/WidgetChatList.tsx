'use client';

import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '@/app/_types';
import { WidgetChatConfig } from '@/app/_types/widget';
import WidgetChatItem from './WidgetChatItem';

interface WidgetChatListProps {
  messages: ChatMessage[];
  config: WidgetChatConfig;
}

const WidgetChatList: React.FC<WidgetChatListProps> = ({ messages, config }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {messages.map((message, index) => (
        <WidgetChatItem
          key={`${message.user_idx}-${index}`}
          message={message}
          showProfileImage={config.showProfileImage}
          fontSize={config.fontSize}
          style={config.style}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default WidgetChatList;
