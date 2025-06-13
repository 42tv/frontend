import InfoTabs from "./tab_menu";
import UserInfo from "./user_info";

export default function MyLayOut({ children } : { children: React.ReactNode }) {
    return (
        <div className="flex flex-col w-full h-full bg-background dark:bg-background-dark min-h-screen">
            <UserInfo />
            <InfoTabs />
            {children}
        </div>
    )
}