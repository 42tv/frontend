import { FanLevel } from './ui';
import { UserInfo, CurrentUser } from './user';

export interface Post {
  id: number;
  message: string;
  sender: {
    idx: number;
    userId: string;
    nickname: string;
  };
  recipient: {
    idx: number;
    userId: string;
    nickname: string;
  };
  is_read: boolean;
  sentAt: string;
  readAt: string;
}

export interface PostSetting {
  fanLevels: FanLevel[];
  minFanLevel: number | null;
}

export interface MessageSettingsModalProps {
  closeModal: () => void;
  postSetting?: PostSetting;
  setPostSetting: React.Dispatch<React.SetStateAction<PostSetting | undefined>>;
}

export interface UserActionsModalProps {
  userInfo: UserInfo;
  currentUser: CurrentUser;
  onClose?: () => void;
  onKick?: (userIdx: number) => void;
  onBan?: (userIdx: number) => void;
  onUnban?: (userIdx: number) => void;
  onPromoteManager?: (userIdx: number) => void;
  onDemoteManager?: (userIdx: number) => void;
  onSendMessage?: (userIdx: number) => void;
}
