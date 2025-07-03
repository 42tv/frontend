import { User } from './user';
import { PlayData } from './live';

export interface ModalState {
  isOpen: boolean;
  content: React.ReactNode | null;
  openModal?: (content: React.ReactNode) => void;
  openError?: (content: React.ReactNode) => void;
  openPopup?: (content: React.ReactNode) => void;
  closeModal?: () => void;
  closePopup?: () => void;
}

export interface UserState extends User {
  setUser: (user: User) => void;
  setNickname: (newNickname: string) => void;
  setProfileImg: (newProfileImg: string) => void;
  fetchUser: () => Promise<void>;
}

export interface PlayState {
  playData: PlayData | null;
  setPlayData: (playData: PlayData) => void;
}
