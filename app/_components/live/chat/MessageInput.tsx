'use client';
import React, { useState } from 'react';

interface MessageInputProps {
    onSendMessage: (message: string) => Promise<void>;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;
        
        await onSendMessage(newMessage);
        setNewMessage('');
    };

    return (
        <form onSubmit={handleSubmit} className="p-3 border-t border-border-secondary dark:border-border-secondary-dark flex">
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="메시지 입력..."
                className="flex-1 bg-bg-tertiary dark:bg-bg-tertiary-dark border border-border-primary dark:border-border-primary-dark rounded-l px-2 py-1 focus:outline-none focus:border-primary text-sm text-text-primary dark:text-text-primary-dark"
            />
            <button
                type="submit"
                className="bg-primary hover:bg-primary-hover text-primary-foreground px-4 py-1 rounded-r text-sm font-semibold"
            >
                전송
            </button>
        </form>
    );
};

export default MessageInput;
