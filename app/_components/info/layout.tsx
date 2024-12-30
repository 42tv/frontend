import UserInfo from "./user_info";

export default function InfoLayOut({ children } : { children: React.ReactNode }) {
    return (
        <div className="flex flex-col w-full h-full">
            <UserInfo />
            {children}
        </div>
    )
}