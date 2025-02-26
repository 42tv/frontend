import { UserResponse } from "@/app/_components/utils/interfaces";
 
export default function UserDefault({userInfo, nickname, setNickname}: { userInfo: UserResponse | null; nickname: string, setNickname: (nickname: string) => void;}) {
    const user_id = userInfo?.user_id;
    const phoneAuth = false;
    const sex = 'male';
    return (
        <div className="px-20 mb-20">
            <div className="font-bold text-2xl text-colorFg01 mb-4"> 
            기본정보
            </div>
            {/* 밑줄 */}
            <div data-orientation="horizontal" role="none" className="shrink-0 bg-contentBg h-[1px] w-full"/>
            <p className="flex flex-row h-[58px] items-center px-4">
                <span className="w-[180px] font-medium text-colorFg01">
                    아이디
                </span>
                <span className="w-[180px] font-medium text-colorFg01">
                    {user_id}
                </span>
            </p>
            <div data-orientation="horizontal" role="none" className="shrink-0 bg-contentBg h-[1px] w-full"/>
            <div className="flex flex-row h-[58px] items-center px-4">
                <span className="w-[180px] font-medium text-colorFg01">
                    닉네임
                </span>
                <div className="flex rounded-lg border border-contentBg w-[300px] h-[40px]">
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => {
                            setNickname(e.target.value)
                        }}
                        className="w-full h-full px-3 py-2 text-[16px] focus-visible:outline-none rounded-lg"
                    />
                </div>
            </div>
            <div className="flex flex-row h-[58px] items-center px-4">
                <span className="w-[180px] font-medium text-colorFg01">
                    본인인증
                </span>
                <span className="w-[180px] font-medium text-colorFg01">
                    {phoneAuth ? "인증완료" : "인증필요"}
                </span>
            </div>
            <div className="flex flex-row h-[58px] items-center px-4">
                <span className="w-[180px] font-medium text-colorFg01">
                    성별
                </span>
                <span className="w-[180px] font-medium text-colorFg01">
                    {
                        sex == "male" ? "남성" : "여성"
                    }
                </span>
            </div>
            <div data-orientation="horizontal" role="none" className="shrink-0 bg-contentBg h-[1px] w-full"/>
        </div>
    )
}