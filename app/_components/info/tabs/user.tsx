import { useEffect, useState } from "react";
import PasswordChange from "./user_tabs_component/password_change";
import UserDefault from "./user_tabs_component/user_default";
import { Button } from "@mui/material";
import { updateNickname, updatePassword } from "@/app/_apis/user";
import { UserResponse } from "../../utils/interfaces";
import errorModalStore from "../../utils/errorModalStore";
import ErrorMessage from "../../modals/error_component";

export default function UserTab({userInfo, setUserInfo} : {userInfo: UserResponse, setUserInfo: (userInfo: UserResponse) => void}) {
    const { openError } = errorModalStore();
    const [nickname, setNickname] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [passwordCheck, setPasswordCheck] = useState<string>("");

    const passwordState = {
        password, setPassword,
        newPassword, setNewPassword,
        passwordCheck, setPasswordCheck
    }

    useEffect(() => {
        setNickname(userInfo.nickname);
    }, [userInfo])
    

    async function updateUserInfo() {
        const isNicknameChanged = userInfo?.nickname != nickname;
        const isPasswordChanged = password != "" && newPassword == passwordCheck;
        if (isNicknameChanged) {
            try {
                const response = await updateNickname(nickname);
                if (!isPasswordChanged) {
                    if (userInfo) {
                        setUserInfo({
                            ...userInfo,
                            nickname: nickname
                        })
                    }
                    openError(<ErrorMessage message={response.message}/>);
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            catch (e: any) {
                setNickname(userInfo.nickname);
                openError(<ErrorMessage message={e.response.data.message}/>);
                return;
            }
        }
        if (password != "" && newPassword != "" && newPassword == passwordCheck) {
            try {
                const response = await updatePassword(password, newPassword);
                openError(<ErrorMessage message={response.message}/>);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            catch (e: any) {
                openError(<ErrorMessage message={e.response.data.message}/>);
                return;
            }
        }

    }

    return (
        <div className="flex flex-col w-full h-full">
            <UserDefault userInfo={userInfo} nickname={nickname} setNickname={setNickname}/>
            <PasswordChange passwordState={passwordState}/>
            <div className="my-[70px] flex justify-center">
                {
                    (nickname != userInfo?.nickname ||  (password != ""  && newPassword != "" && newPassword == passwordCheck))
                    ? 
                    <Button 
                        className="flex items-center justify-center w-[100px]" 
                        variant="contained"
                        onClick={updateUserInfo}
                    >수정</Button>
                    :
                    <Button disabled
                        sx={{
                            bgcolor: "grey.700", // 배경 색 조정 (다크모드에서 보이도록)
                            color: "grey.300", // 글씨 색 조정
                            "&.Mui-disabled": {
                              bgcolor: "grey.700",
                              color: "grey.400",
                            },
                          }}
                        className="flex items-center justify-center w-[100px]"
                    >수정</Button>
                }
            </div>
        </div>
    )
}