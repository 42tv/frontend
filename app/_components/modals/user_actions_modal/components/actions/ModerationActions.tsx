import React from 'react';
import MenuItem from '../../MenuItem';
import { KickIcon, BanIcon } from '../icons/ActionIcons';

interface ModerationActionsProps {
  userId: string;
  onKick?: (userId: string) => void;
  onBan?: (userId: string) => void;
  onClose?: () => void;
  showBan?: boolean;
}

const ModerationActions: React.FC<ModerationActionsProps> = ({
  userId,
  onKick,
  onBan,
  onClose,
  showBan = false
}) => {
  return (
    <>
      {/* 강퇴 */}
      {onKick && (
        <MenuItem
          onClick={() => {
            onKick(userId);
            onClose?.();
          }}
          icon={<KickIcon />}
          text="강퇴하기"
          variant="danger"
        />
      )}

      {/* 차단 */}
      {onBan && showBan && (
        <MenuItem
          onClick={() => {
            onBan(userId);
            onClose?.();
          }}
          icon={<BanIcon />}
          text="차단하기"
          variant="danger"
        />
      )}
    </>
  );
};

export default ModerationActions;