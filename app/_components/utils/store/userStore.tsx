import { getInfo } from '@/app/_apis/user';
import { create } from 'zustand';
import { UserResponse } from '../interfaces';

interface UserState extends UserResponse {
  setUser: (user: UserResponse) => void;
  setNickname: (newNickname: string) => void;
  updateProfileImg: (newProfileImg: string) => void;
  fetchUser: () => Promise<void>;
}

const useUserStore = create<UserState>((set) => ({
  idx: 0,
  user_id: '',
  nickname: '',
  profile_img: '',
  
  setUser: (user: UserResponse) => set({
    idx: user.idx,
    user_id: user.user_id,
    nickname: user.nickname,
    profile_img: user.profile_img,
  }),
  
  setNickname: (newNickname) => set(() => ({
    nickname: newNickname,
  })),
  
  updateProfileImg: (newProfileImg) => set(() => ({
    profile_img: newProfileImg,
  })),
  
  fetchUser: async () => {
    try {
      const response = await getInfo();
      set({
        idx: response.idx,
        user_id: response.user_id,
        nickname: response.nickname,
        profile_img: response.profile_img,
      });
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  },
}));

export default useUserStore;
