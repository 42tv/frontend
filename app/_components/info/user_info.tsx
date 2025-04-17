import useUserStore from "../utils/store/userStore";
import UserProfileImg from "./user_profile_img";

// UserInfo 컴포넌트는 사용자의 프로필 이미지와 닉네임, 코인, 메시지 수를 보여주는 컴포넌트입니다.
export default function UserInfo() {
    const profile_img = useUserStore(state => state.profile_img);
    const nickname = useUserStore(state => state.nickname);
    return (
        <div className="flex flex-col w-full h-[200px] justify-center pt-[48px]">
            <div className="flex justify-center">
                <UserProfileImg
                    profilePath={profile_img} // 기본값 제공
                    width={100}
                    height={100}
                />
            </div>
            <div className='flex-col w-full h-[48px] justify-center items-center text-center'>
                <div>{nickname}</div>
                Coin 100 Message 100
            </div>
        </div>
    )
}