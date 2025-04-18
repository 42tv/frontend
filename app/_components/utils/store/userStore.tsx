import { getLoginInfo } from '@/app/_apis/user';
import { create } from 'zustand';
import { UserResponse } from '../interfaces';

interface UserState extends UserResponse {
  setUser: (user: UserResponse) => void;
  setNickname: (newNickname: string) => void;
  setProfileImg: (newProfileImg: string) => void;
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
  
  setProfileImg: (newProfileImg) => set(() => ({
    profile_img: newProfileImg,
  })),
  
  fetchUser: async () => {
    try {
      const response = await getLoginInfo();
      console.log(response)
      set({
        idx: response.user.idx,
        user_id: response.user.user_id,
        nickname: response.user.nickname,
        profile_img: response.user.profile_img,
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
    }
  },
}));

export default useUserStore;
