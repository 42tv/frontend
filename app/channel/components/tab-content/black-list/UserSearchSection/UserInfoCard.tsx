import React from 'react';
import { MdBlock } from "react-icons/md";
import { UserInfo } from './useUserSearch';

interface UserInfoCardProps {
  userInfo: UserInfo;
  isLoading: boolean;
  onBlockUser: () => void;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({
  userInfo,
  isLoading,
  onBlockUser
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-700/50 to-gray-700/30 rounded-lg border border-gray-600/50">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center ring-2 ring-gray-600/50">
          {userInfo.profile_img ? (
            <img 
              src={userInfo.profile_img} 
              alt={userInfo.nickname} 
              className="w-full h-full object-cover"
            />
          ) : (
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm">{userInfo.nickname}</p>
          <p className="text-xs text-gray-400">ID: {userInfo.user_id}</p>
        </div>
        <button
          onClick={onBlockUser}
          disabled={isLoading}
          className="p-1 text-red-500 dark:text-red-500 hover:text-red-500 hover:bg-gray-700 dark:hover:text-red-400 dark:hover:bg-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed rounded transition-colors"
          title="차단"
        >
          <MdBlock className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default UserInfoCard;