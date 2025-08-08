export interface BlacklistUser {
  user_idx: number;
  user_id: string;
  nickname: string;
  profile_img: string;
  blocked_at: string;
}

export interface BlacklistSearchFormProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export interface BlacklistStatsProps {
  totalCount: number;
  onBlockUser: (userId: string) => Promise<void>;
  isLoading: boolean;
}

export interface BlacklistStatsOnlyProps {
  totalCount: number;
}

export interface BlacklistTableProps {
  users: BlacklistUser[];
  onUnblockUser: (userId: string) => Promise<void>;
  isLoading: boolean;
}

export interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBlock: (userId: string) => Promise<void>;
  isLoading: boolean;
}

export interface UserSearchSectionProps {
  onBlockUser: (userId: string) => Promise<void>;
  isLoading: boolean;
}

export interface BlockedUser {
  id: number;
  blocked: {
    idx: number;
    user_id: string;
    nickname: string;
    profile_img: string;
  };
  created_at: string;
}
