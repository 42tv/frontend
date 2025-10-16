'use client';
import React, { useRef, useEffect } from 'react';
import { Message, ChatMessage } from '@/app/_types';
import ChatMessageItem from './ChatMessageItem';

interface ChatMessageListProps {
    messages: Message[];
    onChatClick: (message: ChatMessage) => void;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, onChatClick }) => {
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    // 새 메시지 수신 시 스크롤 맨 아래로 이동
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="p-3 space-y-2">
            {messages.map((msg, index) => (
                <div key={index} className="text-sm">
                    <ChatMessageItem 
                        message={msg} 
                        onChatClick={onChatClick} 
                    />
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatMessageList;
