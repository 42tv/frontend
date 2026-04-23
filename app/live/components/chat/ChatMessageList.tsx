'use client';
import React, { useRef, useEffect } from 'react';
import { Message, ChatMessage } from '@/app/_types';
import { WidgetChatStyle } from '@/app/_types/widget';
import ChatMessageItem from './ChatMessageItem';

interface ChatMessageListProps {
    messages: Message[];
    onChatClick: (message: ChatMessage) => void;
    chatStyle: WidgetChatStyle;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, onChatClick, chatStyle }) => {
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    // 새 메시지 수신 시 스크롤 맨 아래로 이동
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="p-3 space-y-3">
            {messages.map((msg, index) => (
                <div key={index}>
                    <ChatMessageItem 
                        message={msg} 
                        onChatClick={onChatClick}
                        chatStyle={chatStyle}
                    />
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatMessageList;
