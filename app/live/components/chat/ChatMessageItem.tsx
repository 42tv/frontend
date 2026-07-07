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
    
    if (message.type === 'notice') {
        const noticeClassName = 'rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3';

        const sentAt = new Date(message.sent_at);
        const sentAtLabel = isNaN(sentAt.getTime())
            ? ''
            : sentAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

        return (
            <div className={noticeClassName}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-red-400">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M13.9 3.2 6.6 7.4H3.5A1.5 1.5 0 0 0 2 8.9v6.2a1.5 1.5 0 0 0 1.5 1.5h3.1l7.3 4.2a1 1 0 0 0 1.5-.9V4.1a1 1 0 0 0-1.5-.9ZM18 9.5v5a2.5 2.5 0 0 0 0-5Z" />
                        </svg>
                        운영자 공지
                    </div>
                    {sentAtLabel && (
                        <span className="text-[11px] text-red-400/60">{sentAtLabel}</span>
                    )}
                </div>
                <div className="mt-1.5 text-sm font-medium text-white whitespace-pre-wrap break-words">
                    {message.message}
                </div>
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
