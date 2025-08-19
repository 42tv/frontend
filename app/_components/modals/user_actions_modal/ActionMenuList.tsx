import React from 'react';
import { ChatMessage, MyRole } from '@/app/_types';
import { useUserPermissions } from './useUserPermissions';

// Components
import ProfileAction from './components/actions/ProfileAction';
import MessageAction from './components/actions/MessageAction';
import ModerationActions from './components/actions/ModerationActions';
import ManagerActions from './components/actions/ManagerActions';

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
        <ProfileAction
          userId={user.user_id}
          onViewProfile={onViewProfile}
          onClose={onClose}
        />
      )}

      {canPerformActions() && (
        <>
          {/* 쪽지 보내기 */}
          {onSendMessage && canSendMessage() && (
            <MessageAction
              userId={user.user_id}
              nickname={user.nickname}
              onSendMessage={onSendMessage}
              onClose={onClose}
            />
          )}

          {/* 방송자 권한: 모든 사용자에 대해 kick, ban 가능 */}
          {canBroadcasterManage() && (
            <ModerationActions
              userId={user.user_id}
              onKick={onKick}
              onBan={onBan}
              onClose={onClose}
              showBan={canBanUser()}
            />
          )}

          {/* 매니저 권한: broadcaster, manager를 제외한 사용자에 대해 kick 가능 */}
          {canManagerKick() && (
            <ModerationActions
              userId={user.user_id}
              onKick={onKick}
              onClose={onClose}
              showBan={false}
            />
          )}

          {/* 방송자 전용: 매니저 승격/해제 */}
          {canManageManagerRole() && (
            <ManagerActions
              userId={user.user_id}
              isManager={user.role === 'manager'}
              onPromoteManager={onPromoteManager}
              onDemoteManager={onDemoteManager}
              onClose={onClose}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ActionMenuList;