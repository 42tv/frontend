import { getLoginInfo } from '@/app/_apis/user';
import { create } from 'zustand';
import { User } from '@/app/_types';

interface UserState extends User {
  setUser: (user: User) => void;
  setNickname: (newNickname: string) => void;
  setProfileImg: (newProfileImg: string) => void;
  fetchUser: () => Promise<void>;
}

const useUserStore = create<UserState>((set) => ({
  idx: 0,
  user_id: '',
  nickname: '',
  profile_img: '',
  is_guest: true,
  
  setUser: (user: User) => set({
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
        is_guest: response.is_guest
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
    }
  },
}));

export default useUserStore;
