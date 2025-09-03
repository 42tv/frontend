'use client';
import React from 'react';
import { Message, ChatMessage } from '@/app/_types';

interface ChatMessageItemProps {
    message: Message;
    onChatClick: (message: ChatMessage) => void;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, onChatClick }) => {
    if (message.type === 'chat') {
        return (
            <div 
                onClick={() => onChatClick(message)}
                className="cursor-pointer hover:bg-bg-tertiary dark:hover:bg-bg-tertiary-dark p-2 rounded transition-colors duration-150"
            >
                <div className="flex items-center space-x-2 justify-center">
                    <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: message.color || '#6B7280' }}
                    >
                        {
                            message.role === 'broadcaster' ? 'B' :
                            message.role === 'manager' ? 'M' :
                            message.grade.charAt(0).toUpperCase()
                        }
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1">
                            <span className="font-semibold text-text-primary dark:text-text-primary-dark">
                                {message.nickname}
                            </span>
                            {message.role === 'broadcaster' && (
                                <span className="text-xs bg-red-500 text-white px-1 rounded">방송자</span>
                            )}
                            {message.role === 'manager' && (
                                <span className="text-xs bg-blue-500 text-white px-1 rounded">매니저</span>
                            )}
                        </div>
                        <div className="break-words text-text-primary dark:text-text-primary-dark">
                            {message.message}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (message.type === 'donation') {
        return (
            <div className="text-success dark:text-success-dark">
                <span className="font-semibold">{message.donor_nickname}</span>님이 {message.amount}을 후원했습니다!
                {message.message && (
                    <div className="ml-2 italic">{message.message}</div>
                )}
            </div>
        );
    }
    
    if (message.type === 'recommend') {
        return (
                <div className="text-warning dark:text-warning-dark text-center text-sm">
                    <span className="font-semibold">'{message.nickname}'</span> 님이 추천하셨습니다.
                </div>
        );
    }
    
    return null;
};

export default ChatMessageItem;
