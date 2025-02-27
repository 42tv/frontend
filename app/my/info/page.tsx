'use client'
import { getInfo } from "@/app/_apis/user";
import TabMenu from "@/app/_components/info/tab_menu";
import UserTab from "@/app/_components/info/tabs/user";
import UserInfo from "@/app/_components/info/user_info";
import { UserResponse } from "@/app/_components/utils/interfaces";
import { useEffect, useState } from "react";

export default function InfoTab() {
    const [userInfo, setUserInfo] = useState<UserResponse>({
        idx: 0,
        user_id: "",
        nickname: "",
        profile_img: "",
    });

    useEffect(() => {
        async function fetchUser() {
            const user = await getInfo();
            console.log(user);
            setUserInfo(user);
        }
        fetchUser();
    }, [])

    return (
        <div className="flex flex-col w-full h-full">
            {
                userInfo && 
                    <>
                        <UserInfo userInfo={userInfo} /> 
                        <TabMenu />
                        <UserTab userInfo={userInfo} setUserInfo={setUserInfo}/>
                    </>
            }
        </div>
            
    )
}