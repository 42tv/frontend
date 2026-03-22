'use client';

import React from 'react';
import { ChatMessage } from '@/app/_types';
import { WidgetFontSize } from '@/app/_types/widget';

interface WidgetChatItemProps {
  message: ChatMessage;
  showProfileImage: boolean;
  fontSize: WidgetFontSize;
  style: 'compact' | 'bubble' | 'notice';
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

// compact 스타일: 왼쪽 컬러 액센트 바 + 세련된 배경
function CompactItem({ message, showProfileImage, fontSize }: Omit<WidgetChatItemProps, 'style'>) {
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
      {/* 왼쪽 액센트 바 */}
      <div
        className="w-[3px] flex-shrink-0 rounded-l-lg"
        style={{
          background: `linear-gradient(180deg, ${accentColor}cc 0%, ${accentColor}55 100%)`,
        }}
      />

      <div className="flex-1 px-3 py-2">
        {/* 닉네임 + 뱃지 */}
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

        {/* 메시지 본문 */}
        <div
          className={`mt-1.5 break-words leading-snug text-white/90 ${fontSizeClass[fontSize]}`}
        >
          {message.message}
        </div>
      </div>
    </div>
  );
}

// bubble 스타일: 아바타 + 말풍선
function BubbleItem({ message, showProfileImage, fontSize }: Omit<WidgetChatItemProps, 'style'>) {
  const accentColor = message.color || '#a78bfa';

  return (
    <div className="flex items-end gap-2.5 animate-widget-in">
      {showProfileImage && (
        <div
          className="h-8 w-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mb-0.5"
          style={{
            background: `linear-gradient(135deg, ${accentColor}cc, ${accentColor}88)`,
            boxShadow: `0 0 8px ${accentColor}55`,
          }}
        >
          {getBadgeLabel(message)}
        </div>
      )}

      <div
        className="max-w-[300px] rounded-2xl rounded-bl-sm px-4 py-2.5 backdrop-blur-md"
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.65) 0%, rgba(15,15,25,0.75) 100%)',
          boxShadow: `0 2px 12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.06)`,
        }}
      >
        <div className="flex items-center gap-1.5 mb-1">
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
    </div>
  );
}

const WidgetChatItem: React.FC<WidgetChatItemProps> = ({ message, showProfileImage, fontSize, style }) => {
  if (style === 'bubble') {
    return <BubbleItem message={message} showProfileImage={showProfileImage} fontSize={fontSize} />;
  }
  return <CompactItem message={message} showProfileImage={showProfileImage} fontSize={fontSize} />;
};

export default WidgetChatItem;
