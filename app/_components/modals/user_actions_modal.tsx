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

  // 현재 유저가 해당 유저에 대해 액션을 취할 수 있는지 확인
  const canTakeAction = () => {
    console.log('Checking permissions:', { currentUser, userInfo });
    if (currentUser.idx === userInfo.idx) return false; // 자기 자신에게는 액션 불가
    if (currentUser.role === 'broadcaster') return true; // 방송자는 모든 액션 가능
    if (currentUser.role === 'manager' && userInfo.role === 'viewer') return true; // 매니저는 일반 시청자에게만 액션 가능
    return false;
  };

  const canManageRole = () => {
    const result = currentUser.role === 'broadcaster' && userInfo.role !== 'broadcaster';
    console.log('Can manage role:', result);
    return result;
  };

  const handleAction = async (action: () => void) => {
    try {
      action();
      closeModal();
    } catch (error) {
      console.error('Action failed:', error);
      // TODO: 에러 모달 표시
    }
  };

  const hasAnyActions = canTakeAction() || canManageRole() || onSendMessage;

  console.log('Modal render check:', { 
    canTakeAction: canTakeAction(), 
    canManageRole: canManageRole(), 
    hasAnyActions,
    onSendMessage: !!onSendMessage 
  });

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

        {hasAnyActions && (
          <div className="space-y-2">
            {/* 쪽지 보내기 */}
            {onSendMessage && (
              <button
                onClick={() => handleAction(() => onSendMessage(userInfo.idx))}
                className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
              >
                쪽지 보내기
              </button>
            )}

            {/* 강퇴 */}
            {canTakeAction() && onKick && (
              <button
                onClick={() => handleAction(() => onKick(userInfo.idx))}
                className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm"
              >
                강퇴
              </button>
            )}

            {/* 차단 */}
            {canTakeAction() && onBan && (
              <button
                onClick={() => handleAction(() => onBan(userInfo.idx))}
                className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
              >
                차단
              </button>
            )}

            {/* 차단 해제 */}
            {canTakeAction() && onUnban && (
              <button
                onClick={() => handleAction(() => onUnban(userInfo.idx))}
                className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
              >
                차단 해제
              </button>
            )}

            {/* 매니저 권한 부여 */}
            {canManageRole() && userInfo.role === 'viewer' && onPromoteManager && (
              <button
                onClick={() => handleAction(() => onPromoteManager(userInfo.idx))}
                className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded text-sm"
              >
                매니저로 승격
              </button>
            )}

            {/* 매니저 권한 해제 */}
            {canManageRole() && userInfo.role === 'manager' && onDemoteManager && (
              <button
                onClick={() => handleAction(() => onDemoteManager(userInfo.idx))}
                className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded text-sm"
              >
                매니저 해제
              </button>
            )}
          </div>
        )}

        <div className={`${hasAnyActions ? 'mt-4' : ''} flex justify-end`}>
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
