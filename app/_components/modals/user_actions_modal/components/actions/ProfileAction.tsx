import React from 'react';
import MenuItem from '../../MenuItem';
import { ProfileIcon } from '../icons/ActionIcons';

interface ProfileActionProps {
  userId: string;
  onViewProfile: (userId: string) => void;
  onClose?: () => void;
}

const ProfileAction: React.FC<ProfileActionProps> = ({
  userId,
  onViewProfile,
  onClose
}) => {
  return (
    <MenuItem
      onClick={() => {
        onViewProfile(userId);
        onClose?.();
      }}
      icon={<ProfileIcon />}
      text="프로필 보기"
    />
  );
};

export default ProfileAction;