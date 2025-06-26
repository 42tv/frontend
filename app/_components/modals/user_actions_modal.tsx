'use client';
import React from 'react';
import useModalStore from '../utils/store/modalStore';

interface UserInfo {
  idx: number;
  nickname: string;
  profileImg?: string;
  role: string;
}

interface CurrentUser {
  idx: number;
  role?: 'broadcaster' | 'manager' | 'viewer';
}

interface UserActionsModalProps {
  userInfo: UserInfo;
  currentUser: CurrentUser;
  onKick?: (userIdx: number) => void;
  onBan?: (userIdx: number) => void;
  onUnban?: (userIdx: number) => void;
  onPromoteManager?: (userIdx: number) => void;
  onDemoteManager?: (userIdx: number) => void;
  onSendMessage?: (userIdx: number) => void;
}

const UserActionsModal: React.FC<UserActionsModalProps> = ({
  userInfo,
  currentUser,
  onKick,
  onBan,
  onUnban,
  onPromoteManager,
  onDemoteManager,
  onSendMessage,
}) => {
  const { closeModal } = useModalStore();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-bg-primary dark:bg-bg-primary-dark rounded-lg shadow-lg p-6 w-80 max-w-sm mx-4">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 mr-3 overflow-hidden">
            {userInfo.profileImg ? (
              <img 
                src={userInfo.profileImg} 
                alt={`${userInfo.nickname} 프로필`}
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
          <div>
            <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
              {userInfo.nickname}
            </h3>
            <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
              {userInfo.role === 'broadcaster' ? '방송자' : 
               userInfo.role === 'manager' ? '매니저' : '시청자'}
            </p>
          </div>
        </div>

        <div className={`flex justify-end`}>
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-text-primary dark:text-text-primary-dark rounded hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserActionsModal;
