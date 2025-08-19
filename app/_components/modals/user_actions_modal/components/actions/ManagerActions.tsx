import React from 'react';
import MenuItem from '../../MenuItem';
import { PromoteIcon, DemoteIcon } from '../icons/ActionIcons';

interface ManagerActionsProps {
  userId: string;
  isManager: boolean;
  onPromoteManager?: (userId: string) => void;
  onDemoteManager?: (userId: string) => void;
  onClose?: () => void;
}

const ManagerActions: React.FC<ManagerActionsProps> = ({
  userId,
  isManager,
  onPromoteManager,
  onDemoteManager,
  onClose
}) => {
  if (isManager && onDemoteManager) {
    return (
      <MenuItem
        onClick={() => {
          onDemoteManager(userId);
          onClose?.();
        }}
        icon={<DemoteIcon />}
        text="매니저 해임"
        variant="danger"
      />
    );
  }

  if (!isManager && onPromoteManager) {
    return (
      <MenuItem
        onClick={() => {
          onPromoteManager(userId);
          onClose?.();
        }}
        icon={<PromoteIcon />}
        text="매니저 부여"
        variant="primary"
      />
    );
  }

  return null;
};

export default ManagerActions;