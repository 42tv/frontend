import { getLoginInfo } from '@/app/_apis/user';
import { create } from 'zustand';
import { CoinInfo } from '@/app/_types';

const DEFAULT_COIN: CoinInfo = { balance: 0, charged: 0, used: 0, received: 0 };

interface UserState {
  idx: number;
  user_id: string;
  nickname: string;
  profile_img: string;
  is_guest: boolean;
  is_admin: boolean;
  coin: CoinInfo;
  identity_verified: boolean;

  setNickname: (newNickname: string) => void;
  setProfileImg: (newProfileImg: string) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setCoin: (coin: CoinInfo) => void;
  setIdentityVerified: (verified: boolean) => void;
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
  coin: DEFAULT_COIN,
  identity_verified: false,

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

  setIdentityVerified: (verified: boolean) => set(() => ({
    identity_verified: verified,
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
          coin: DEFAULT_COIN,
          identity_verified: false,
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
          coin: response.data.user.coin,
          identity_verified: response.data.user.identity_verified ?? false,
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
        coin: DEFAULT_COIN,
        identity_verified: false,
      });
    }
  },

  isAdminUser: () => {
    const state = get();
    return state.is_admin === true;
  },
}));

export default useUserStore;
