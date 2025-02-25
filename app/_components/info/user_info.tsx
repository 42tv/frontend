import UserProfileImg from "./user_profile_img";

// UserInfo 컴포넌트는 사용자의 프로필 이미지와 닉네임, 코인, 메시지 수를 보여주는 컴포넌트입니다.
export default function UserInfo() {
    return (
        <div className="flex flex-col w-full h-[200px] justify-center pt-[48px]">
            <UserProfileImg 
                profilePath="/icons/anonymouse1.svg"  // 차후 서버에서 받아오는 형태로 변경해야 할수도
                width={100}
                height={100}
            />
            <div className='flex-col w-full h-[48px] justify-center items-center text-center'>
                <div>닉네임</div>
                Coin 100 Message 100
            </div>
        </div>
    )
}