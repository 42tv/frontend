import { useEffect, useState } from "react";
import PasswordChange from "./user_tabs_component/password_change";
import UserDefault from "./user_tabs_component/user_default";
import { Button } from "@mui/material";
import { getInfo, updateNickname, updatePassword } from "@/app/_apis/user";
import { UserResponse } from "../../utils/interfaces";
import errorModalStore from "../../utils/errorModalStore";
import ErrorMessage from "../../modals/error_component";

export default function UserTab() {
    const { openError } = errorModalStore();
    const [userInfo, setUserInfo] = useState<UserResponse | null>(null);
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
        async function fetchUser() {
            const user = await getInfo();
            setNickname(user?.nickname);
            setUserInfo(user);
        }
        fetchUser();
    }, [])

    async function updateUserInfo() {
        if (userInfo?.nickname != nickname) {
            try {
                await updateNickname(nickname);
            }
            catch (e: any) {
                openError(<ErrorMessage message={e.response.data.message}/>);
                return;
            }
        }
        if (password != "" && newPassword == passwordCheck) {
            try {
                const response = await updatePassword(password, newPassword);
                openError(<ErrorMessage message={response.message}/>);
            }
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
                <Button 
                    className="flex items-center justify-center w-[100px]" 
                    variant="contained"
                    onClick={updateUserInfo}
                >수정</Button>
            </div>
        </div>
    )
}