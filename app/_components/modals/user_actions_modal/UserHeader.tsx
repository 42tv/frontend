import React from 'react';
import { ChatMessage, UserRole } from '@/app/_types';
import Image from 'next/image';

interface UserHeaderProps {
  user: ChatMessage;
}

const UserHeader: React.FC<UserHeaderProps> = ({ user }) => {
  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'broadcaster':
        return '방송자';
      case 'manager':
        return '매니저';
      case 'viewer':
        return '시청자';
      case 'guest':
        return '게스트';
      default:
        return '사용자';
    }
  };

  return (
    <div className="px-6 pb-4">
      <div className="flex items-center gap-3">
        {/* 프로필 이미지 */}
        <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden flex-shrink-0">
          {user.profile_img ? (
            <Image 
              src={user.profile_img} 
              alt={user.nickname}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
          )}
        </div>
        {/* 사용자 정보 */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark truncate">
            {user.nickname}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
              user.role === 'broadcaster' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
              user.role === 'manager' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}>
              {getRoleDisplayName(user.role)}
            </span>
          </div>
        </div>
      </div>
      {/* 2025년 07월 27일부터 골운 */}
      <div className="mt-3 flex items-center gap-2 text-sm text-text-secondary dark:text-text-secondary-dark">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <span>2025년 07월 27일부터 골운</span>
      </div>
    </div>
  );
};

export default UserHeader;