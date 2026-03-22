'use client';
import React, { useState } from 'react';
import { WidgetChatStyle } from '@/app/_types/widget';

interface MessageInputProps {
    onSendMessage: (message: string) => Promise<void>;
    chatStyle: WidgetChatStyle;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, chatStyle }) => {
    const [newMessage, setNewMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;
        
        await onSendMessage(newMessage);
        setNewMessage('');
    };

    const frameClassName =
        chatStyle === 'bubble'
            ? 'rounded-2xl border border-white/10 bg-black/35 px-3 py-2 backdrop-blur-sm'
            : chatStyle === 'notice'
                ? 'rounded-2xl border border-[#ffcf6a]/25 bg-[#2b2210] px-3 py-2'
                : 'rounded-xl border border-border-primary bg-bg-tertiary px-3 py-2';

    return (
        <form onSubmit={handleSubmit} className="p-3 border-t border-border-secondary dark:border-border-secondary-dark">
            <div className={frameClassName}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="메시지 입력..."
                    className="w-full bg-transparent text-sm text-text-primary dark:text-text-primary-dark focus:outline-none"
                />
            </div>
        </form>
    );
};

export default MessageInput;
