import React from 'react';
import MenuItem from '../../MenuItem';
import { MessageIcon } from '../icons/ActionIcons';

interface MessageActionProps {
  userId: string;
  nickname: string;
  onSendMessage: (userId: string, nickname: string) => void;
  onClose?: () => void;
}

const MessageAction: React.FC<MessageActionProps> = ({
  userId,
  nickname,
  onSendMessage
}) => {
  return (
    <MenuItem
      onClick={() => {
        onSendMessage(userId, nickname);
        // onClose는 호출하지 않음 - 모달 교체를 위해
      }}
      icon={<MessageIcon />}
      text="쪽지 보내기"
      variant="primary"
    />
  );
};

export default MessageAction;