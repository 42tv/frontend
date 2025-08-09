'use client';
import { ChatMessage, MyRole, UserRole } from '@/app/_types';
import React from 'react';

interface UserActionsModalProps {
  user: ChatMessage;
  currentUser: MyRole;
  onClose?: () => void;
  onKick?: (userId: string) => void;
  onBan?: (userId: string) => void;
  onUnban?: (userId: string) => void;
  onPromoteManager?: (userId: string) => void;
  onDemoteManager?: (userId: string) => void;
  onSendMessage?: (userId: string, nickname: string) => void;
  onViewProfile?: (userId: string) => void;
}

const UserActionsModal: React.FC<UserActionsModalProps> = ({
  user,
  currentUser,
  onClose,
  onKick,
  onBan,
  onPromoteManager,
  onDemoteManager,
  onSendMessage,
  onViewProfile,
}) => {

  const getRoleDisplayName = (role: UserRole) => {
    console.log(role);
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

  const canPerformActions = () => {
    return user.role !== 'guest' && currentUser.user_idx !== user.user_idx;
  };

  // 방송자는 모든 사용자에 대해 kick, ban 가능
  const canBroadcasterManage = () => {
    return currentUser.role === 'broadcaster' && 
           currentUser.user_idx !== user.user_idx;
  };

  // 매니저는 broadcaster, manager를 제외한 사용자에 대해 kick 가능
  const canManagerKick = () => {
    return currentUser.role === 'manager' && 
           currentUser.user_idx !== user.user_idx && 
           user.role !== 'broadcaster' && 
           user.role !== 'manager';
  };

  // 방송자만 매니저 부여/해임 가능
  const canManageManagerRole = () => {
    return currentUser.role === 'broadcaster' && 
           currentUser.user_idx !== user.user_idx && 
           user.role !== 'broadcaster';
  };

  // 메뉴 아이템 컴포넌트
  const MenuItem = ({ 
    onClick, 
    icon, 
    text, 
    variant = 'default' 
  }: { 
    onClick: () => void; 
    icon: React.ReactNode; 
    text: string; 
    variant?: 'default' | 'danger' | 'primary' 
  }) => {
    const baseClasses = "w-full px-4 py-3 flex items-center gap-3 text-left transition-colors";
    const variantClasses = {
      default: "text-text-primary dark:text-text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-700",
      danger: "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
      primary: "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
    };

    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variantClasses[variant]}`}
      >
        <span className="w-5 h-5 flex-shrink-0">{icon}</span>
        <span className="flex-1">{text}</span>
      </button>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
         onClick={onClose}>
      <div className="bg-bg-primary dark:bg-bg-primary-dark rounded-lg shadow-lg w-80 max-w-sm mx-4 overflow-hidden"
           onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <div className="flex justify-end p-2">
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Header */}
        <div className="px-6 pb-4">
          <div className="flex items-center gap-3">
            {/* 프로필 이미지 */}
            <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden flex-shrink-0">
              {user.profile_img ? (
                <img 
                  src={user.profile_img} 
                  alt={user.nickname}
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

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700"></div>

        {/* Action Buttons */}
        <div className="py-2">
          {/* 프로필 보기 - 모든 사용자가 가능 */}
          {onViewProfile && (
            <MenuItem
              onClick={() => {
                onViewProfile(user.user_id);
                onClose?.();
              }}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              text="프로필 보기"
            />
          )}

          {canPerformActions() && (
            <>
              {/* 쪽지 보내기 */}
              {onSendMessage && (
                <MenuItem
                  onClick={() => {
                    onSendMessage(user.user_id, user.nickname);
                    // onClose는 호출하지 않음 - 모달 교체를 위해
                  }}
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  }
                  text="쪽지 보내기"
                  variant="primary"
                />
              )}

              {/* 방송자 권한: 모든 사용자에 대해 kick, ban 가능 */}
              {canBroadcasterManage() && (
                <>
                  {/* 강퇴 */}
                  {onKick && (
                    <MenuItem
                      onClick={() => {
                        onKick(user.user_id);
                        onClose?.();
                      }}
                      icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      }
                      text="강퇴하기"
                      variant="danger"
                    />
                  )}

                  {/* 차단 */}
                  {onBan && (
                    <MenuItem
                      onClick={() => {
                        onBan(user.user_id);
                        onClose?.();
                      }}
                      icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                        </svg>
                      }
                      text="차단하기"
                      variant="danger"
                    />
                  )}
                </>
              )}

              {/* 매니저 권한: broadcaster, manager를 제외한 사용자에 대해 kick 가능 */}
              {canManagerKick() && (
                <>
                  {/* 강퇴 */}
                  {onKick && (
                    <MenuItem
                      onClick={() => {
                        onKick(user.user_id);
                        onClose?.();
                      }}
                      icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      }
                      text="강퇴하기"
                      variant="danger"
                    />
                  )}
                </>
              )}

              {/* 방송자 전용: 매니저 승격/해제 */}
              {canManageManagerRole() && (
                <>
                  {user.role === 'manager' ? (
                    onDemoteManager && (
                      <MenuItem
                        onClick={() => {
                          onDemoteManager(user.user_id);
                          onClose?.();
                        }}
                        icon={
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        }
                        text="매니저 해임"
                        variant="danger"
                      />
                    )
                  ) : (
                    onPromoteManager && (
                      <MenuItem
                        onClick={() => {
                          onPromoteManager(user.user_id);
                          onClose?.();
                        }}
                        icon={
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                        }
                        text="매니저 부여"
                        variant="primary"
                      />
                    )
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserActionsModal;
