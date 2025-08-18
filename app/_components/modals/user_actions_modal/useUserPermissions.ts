import { ChatMessage, MyRole } from '@/app/_types';

interface UseUserPermissionsProps {
  user: ChatMessage;
  currentUser: MyRole;
}

export const useUserPermissions = ({ user, currentUser }: UseUserPermissionsProps) => {
  const canPerformActions = () => {
    return currentUser.user_idx !== user.user_idx;
  };

  // guest에게는 쪽지 보내기 불가
  const canSendMessage = () => {
    return user.role !== 'guest' && canPerformActions();
  };

  // 방송자는 모든 사용자에 대해 kick, ban 가능
  const canBroadcasterManage = () => {
    return currentUser.role === 'broadcaster' && 
           currentUser.user_idx !== user.user_idx;
  };

  // guest는 차단할 수 없음
  const canBanUser = () => {
    return user.role !== 'guest' && canBroadcasterManage();
  };

  // 매니저는 broadcaster, manager를 제외한 사용자에 대해 kick 가능
  const canManagerKick = () => {
    return currentUser.role === 'manager' && 
           currentUser.user_idx !== user.user_idx && 
           user.role !== 'broadcaster' && 
           user.role !== 'manager';
  };

  // 방송자만 매니저 부여/해임 가능 (guest는 제외)
  const canManageManagerRole = () => {
    return currentUser.role === 'broadcaster' && 
           currentUser.user_idx !== user.user_idx && 
           user.role !== 'broadcaster' &&
           user.role !== 'guest';
  };

  return {
    canPerformActions,
    canSendMessage,
    canBroadcasterManage,
    canBanUser,
    canManagerKick,
    canManageManagerRole
  };
};