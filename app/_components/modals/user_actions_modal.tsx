'use client';
import { ChatMessage, MyRole } from '@/app/_types';
import React from 'react';
import CloseButton from './user_actions_modal/CloseButton';
import UserHeader from './user_actions_modal/UserHeader';
import ActionMenuList from './user_actions_modal/ActionMenuList';

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
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
         onClick={onClose}>
      <div className="bg-bg-primary dark:bg-bg-primary-dark rounded-lg shadow-lg w-80 max-w-sm mx-4 overflow-hidden"
           onClick={(e) => e.stopPropagation()}>
        
        <CloseButton onClose={onClose} />
        <UserHeader user={user} />
        
        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700"></div>
        
        <ActionMenuList
          user={user}
          currentUser={currentUser}
          onClose={onClose}
          onKick={onKick}
          onBan={onBan}
          onPromoteManager={onPromoteManager}
          onDemoteManager={onDemoteManager}
          onSendMessage={onSendMessage}
          onViewProfile={onViewProfile}
        />
      </div>
    </div>
  );
};

export default UserActionsModal;