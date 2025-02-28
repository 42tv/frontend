import { useEffect } from "react";
import InfoTabs from "./tab_menu";
import UserInfo from "./user_info";
import useUserStore from "../utils/store/userStore";

export default function MyLayOut({ children } : { children: React.ReactNode }) {
    const fetchUser = useUserStore((state) => state.fetchUser);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);
    
    return (
        <div className="flex flex-col w-full h-full">
            <UserInfo />
            <InfoTabs />
            {children}
        </div>
    )
}