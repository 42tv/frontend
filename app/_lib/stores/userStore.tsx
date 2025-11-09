import { getLoginInfo } from '@/app/_apis/user';
import { create } from 'zustand';
import { User, CoinInfo } from '@/app/_types';

interface UserState extends User {
  setUser: (user: User) => void;
  setNickname: (newNickname: string) => void;
  setProfileImg: (newProfileImg: string) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setCoin: (coin: CoinInfo) => void;
  fetchUser: () => Promise<void>;
  isAdminUser: () => boolean;
}

const useUserStore = create<UserState>((set, get) => ({
  idx: 0,
  user_id: '',
  nickname: '',
  profile_img: '',
  is_guest: true,
  is_admin: false,
  coin: undefined,

  setUser: (user: User) => set({
    idx: user.idx,
    user_id: user.user_id,
    nickname: user.nickname,
    profile_img: user.profile_img,
    is_admin: user.is_admin,
    coin: user.coin,
  }),
  
  setNickname: (newNickname) => set(() => ({
    nickname: newNickname,
  })),
  
  setProfileImg: (newProfileImg) => set(() => ({
    profile_img: newProfileImg,
  })),


  setIsAdmin: (isAdmin) => set(() => ({
    is_admin: isAdmin,
  })),

  setCoin: (coin: CoinInfo) => set(() => ({
    coin: coin,
  })),

  fetchUser: async () => {
    try {
      const response = await getLoginInfo();
      console.log(response);

      // 게스트 사용자인 경우
      if (response.data.is_guest) {
        set({
          idx: 0,
          user_id: '',
          nickname: '',
          profile_img: '',
          is_guest: true,
          is_admin: false,
          coin: undefined
        });
      } else {
        // 인증된 사용자인 경우
        set({
          idx: response.data.user.idx,
          user_id: response.data.user.user_id,
          nickname: response.data.user.nickname,
          profile_img: response.data.user.profile_img,
          is_guest: false,
          is_admin: response.data.is_admin,
          coin: response.data.user.coin
        });
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // 에러 발생 시 게스트 상태로 초기화
      set({
        idx: 0,
        user_id: '',
        nickname: '',
        profile_img: '',
        is_guest: true,
        is_admin: false,
        coin: undefined
      });
    }
  },


  isAdminUser: () => {
    const state = get();
    return state.is_admin === true;
  },
}));

export default useUserStore;
