import React from 'react';
import { ChatMessage, MyRole } from '@/app/_types';
import MenuItem from './MenuItem';
import { useUserPermissions } from './useUserPermissions';

interface ActionMenuListProps {
  user: ChatMessage;
  currentUser: MyRole;
  onClose?: () => void;
  onKick?: (userId: string) => void;
  onBan?: (userId: string) => void;
  onPromoteManager?: (userId: string) => void;
  onDemoteManager?: (userId: string) => void;
  onSendMessage?: (userId: string, nickname: string) => void;
  onViewProfile?: (userId: string) => void;
}

const ActionMenuList: React.FC<ActionMenuListProps> = ({
  user,
  currentUser,
  onClose,
  onKick,
  onBan,
  onPromoteManager,
  onDemoteManager,
  onSendMessage,
  onViewProfile
}) => {
  const {
    canPerformActions,
    canSendMessage,
    canBroadcasterManage,
    canBanUser,
    canManagerKick,
    canManageManagerRole
  } = useUserPermissions({ user, currentUser });

  return (
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
          {onSendMessage && canSendMessage() && (
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
              {onBan && canBanUser() && (
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
  );
};

export default ActionMenuList;