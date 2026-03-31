'use client';
import React from 'react';
import { Message, ChatMessage } from '@/app/_types';
import { WidgetChatStyle } from '@/app/_types/widget';
import ChatCard from '@/app/_components/chat/ChatCard';

interface ChatMessageItemProps {
    message: Message;
    onChatClick: (message: ChatMessage) => void;
    chatStyle: WidgetChatStyle;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, onChatClick, chatStyle }) => {
    if (message.type === 'chat') {
        return (
            <div 
                onClick={() => onChatClick(message)}
                className="cursor-pointer transition-transform duration-150 hover:scale-[1.01]"
            >
                <ChatCard
                    message={message}
                    showProfileImage={true}
                    showUserId={false}
                    fontSize={14}
                    style={chatStyle}
                />
            </div>
        );
    }
    
    if (message.type === 'donation') {
        const donationClassName =
            chatStyle === 'bubble'
                ? 'rounded-2xl border border-emerald-400/20 bg-emerald-950/35 px-4 py-3 backdrop-blur-sm'
                : chatStyle === 'notice'
                    ? 'rounded-2xl border border-[#ffcf6a]/25 bg-[#2b2210] px-4 py-3'
                    : 'rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3';

        return (
            <div className={donationClassName}>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
                    Donation
                </div>
                <div className="mt-1 text-sm text-white">
                    <span className="font-semibold">{message.donor_nickname}</span>님이 {message.amount}을 후원했습니다!
                </div>
                {message.message && (
                    <div className="mt-2 text-sm italic text-white/75">{message.message}</div>
                )}
            </div>
        );
    }
    
    if (message.type === 'recommend') {
        const recommendClassName =
            chatStyle === 'bubble'
                ? 'rounded-2xl border border-sky-400/20 bg-sky-950/30 px-4 py-3 text-center backdrop-blur-sm'
                : chatStyle === 'notice'
                    ? 'rounded-2xl border border-[#79d9ff]/30 bg-[#112531] px-4 py-3 text-center'
                    : 'rounded-xl border border-sky-400/20 bg-sky-400/10 px-4 py-3 text-center';

        return (
                <div className={recommendClassName}>
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
                        Recommend
                    </div>
                    <div className="mt-1 text-sm text-white">
                        <span className="font-semibold">&apos;{message.nickname}&apos;</span> 님이 추천하셨습니다.
                    </div>
                </div>
        );
    }
    
    return null;
};

export default ChatMessageItem;
