'use client';

import React from 'react';
import { ChatMessage } from '@/app/_types';
import { WidgetChatStyle, WidgetFontSize } from '@/app/_types/widget';

export interface ChatCardProps {
  message: ChatMessage;
  showProfileImage: boolean;
  fontSize: WidgetFontSize;
  style: WidgetChatStyle;
}

const fontSizeClass: Record<WidgetFontSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const nicknameFontSizeClass: Record<WidgetFontSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

function getBadgeLabel(message: ChatMessage): string {
  if (message.role === 'broadcaster') return 'BJ';
  if (message.role === 'manager') return 'M';
  return message.grade?.charAt(0).toUpperCase() ?? '?';
}

function RoleBadge({ role }: { role: ChatMessage['role'] }) {
  if (role === 'broadcaster') {
    return (
      <span className="rounded-sm px-1.5 py-0.5 text-[9px] font-bold tracking-wide bg-red-500/80 text-white leading-none uppercase">
        BJ
      </span>
    );
  }
  if (role === 'manager') {
    return (
      <span className="rounded-sm px-1.5 py-0.5 text-[9px] font-bold tracking-wide bg-blue-500/80 text-white leading-none uppercase">
        MOD
      </span>
    );
  }
  return null;
}

function CompactCard({ message, showProfileImage, fontSize }: Omit<ChatCardProps, 'style'>) {
  const accentColor = message.color || '#a78bfa';

  return (
    <div
      className="relative flex items-stretch overflow-hidden rounded-lg backdrop-blur-md animate-widget-in"
      style={{
        background: 'linear-gradient(135deg, rgba(0,0,0,0.65) 0%, rgba(15,15,25,0.75) 100%)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div
        className="w-[3px] flex-shrink-0 rounded-l-lg"
        style={{
          background: `linear-gradient(180deg, ${accentColor}cc 0%, ${accentColor}55 100%)`,
        }}
      />
      <div className="flex-1 px-3 py-2">
        <div className="flex items-center gap-1.5">
          {showProfileImage && (
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0"
              style={{ backgroundColor: accentColor }}
            >
              {getBadgeLabel(message)}
            </div>
          )}
          <span
            className={`font-bold ${nicknameFontSizeClass[fontSize]} leading-none`}
            style={{ color: accentColor }}
          >
            {message.nickname}
          </span>
          <RoleBadge role={message.role} />
        </div>
        <div className={`mt-1.5 break-words leading-snug text-white/90 ${fontSizeClass[fontSize]}`}>
          {message.message}
        </div>
      </div>
    </div>
  );
}


function GradientCard({ message, showProfileImage, fontSize }: Omit<ChatCardProps, 'style'>) {
  const accentColor = message.color || '#a78bfa';

  return (
    <div
      className="rounded-xl px-3.5 py-2.5 animate-widget-in"
      style={{
        background: `linear-gradient(135deg, ${accentColor}30 0%, ${accentColor}0a 100%)`,
        border: `1px solid ${accentColor}44`,
        boxShadow: `0 4px 16px ${accentColor}14`,
      }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        {showProfileImage && (
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0"
            style={{ backgroundColor: accentColor }}
          >
            {getBadgeLabel(message)}
          </div>
        )}
        <span
          className={`font-bold ${nicknameFontSizeClass[fontSize]} leading-none`}
          style={{ color: accentColor }}
        >
          {message.nickname}
        </span>
        <RoleBadge role={message.role} />
      </div>
      <div className={`break-words leading-snug text-white/90 ${fontSizeClass[fontSize]}`}>
        {message.message}
      </div>
    </div>
  );
}

const ChatCard: React.FC<ChatCardProps> = ({ message, showProfileImage, fontSize, style }) => {
  if (style === 'gradient') {
    return <GradientCard message={message} showProfileImage={showProfileImage} fontSize={fontSize} />;
  }
  return <CompactCard message={message} showProfileImage={showProfileImage} fontSize={fontSize} />;
};

export default ChatCard;
