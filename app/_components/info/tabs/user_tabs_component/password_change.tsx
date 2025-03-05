interface PasswordState {
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    newPassword: string;
    setNewPassword: React.Dispatch<React.SetStateAction<string>>;
    passwordCheck: string;
    setPasswordCheck: React.Dispatch<React.SetStateAction<string>>;
}

interface Props {
    passwordState: PasswordState;
}

export default function PasswordChange({passwordState} : Props) {
    return (
        <div className="px-20">
            <div className="font-bold text-2xl dark:text-colorFg01 mb-4"> 
                비밀번호 변경
            </div>
            {/* 밑줄 */}
            <div data-orientation="horizontal" role="none" className="shrink-0 bg-contentBg h-[1px] w-full"/>
            <div className="flex flex-row h-[58px] items-center px-4">
                <span className="w-[180px] font-medium dark:text-colorFg01">
                    기존 비밀번호
                </span>
                <div className="flex rounded-lg border border-contentBg w-[300px] h-[40px]">
                    <input
                        type="password"
                        value={passwordState.password}
                        onChange={(e) => passwordState.setPassword(e.target.value)}
                        className="w-full h-full px-3 py-2 text-[16px] focus-visible:outline-none rounded-lg"
                    />
                </div>
            </div>
            <div className="flex flex-row h-[58px] items-center px-4">
                <span className="w-[180px] font-medium dark:text-colorFg01">
                    변경 비밀번호
                </span>
                <div className="flex rounded-lg border border-contentBg w-[300px] h-[40px]">
                    <input
                        type="password"
                        value={passwordState.newPassword}
                        onChange={(e) => passwordState.setNewPassword(e.target.value)}
                        className="w-full h-full px-3 py-2 text-[16px] focus-visible:outline-none rounded-lg"
                    />
                </div>
            </div>
            <div className="flex flex-row h-[58px] items-center px-4">
                <span className="w-[180px] font-medium dark:text-colorFg01">
                    비밀번호 확인
                </span>
                <div className="flex rounded-lg border border-contentBg w-[300px] h-[40px]">
                    <input
                        type="password"
                        value={passwordState.passwordCheck}
                        onChange={(e) => passwordState.setPasswordCheck(e.target.value)}
                        className="w-full h-full px-3 py-2 text-[16px] focus-visible:outline-none rounded-lg"
                    />
                </div>
            </div>
            <div data-orientation="horizontal" role="none" className="shrink-0 bg-contentBg h-[1px] w-full"/>
        </div>
    )
}