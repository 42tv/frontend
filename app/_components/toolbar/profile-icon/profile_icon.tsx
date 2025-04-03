import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "../../utils/store/userStore";
import { FiUser, FiSettings } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { BiLogOut } from "react-icons/bi";
import { logout } from "@/app/_apis/user";
import { GrChannel } from "react-icons/gr";

export default function ProfileIcon() {
    const profile_img = useUserStore((state) => state.profile_img);
    const nickname = useUserStore((state) => state.nickname) || "Guest";
    const [clicked, setClicked] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    function toggleClick() {
        setClicked((prev) => !prev);
    }

    function handleMenuClick(event: React.MouseEvent) {
        event.stopPropagation(); // 메뉴 내부 클릭 시 이벤트 전파 중단
    }

    async function handleLogout() {
        try {
            await logout();
            window.location.href = "/";
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        catch(e) {
            
        }
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setClicked(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div 
            className="relative rounded-full cursor-pointer"
            onClick={toggleClick}
            ref={menuRef}
        >
            {profile_img ? (
                <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center">
                    <Image src={profile_img} width={40} height={40} alt="profile icon" priority={true} className="rounded-full" />
                </div>
                
            ) : (
                <div className="w-[40px] h-[40px] flex  dark:bg-toolbarBg">
                    <div className="flex w-full h-full rounded-full dark:hover:bg-iconBg-dark hover:bg-iconBg items-center justify-center">
                        <CgProfile size={32}/>
                    </div>
                </div>
                // <Image src="/icons/anonymouse1.svg" width={40} height={40} alt="profile icon" priority={true} className="rounded-full" />
            )}
            <div
                className={`absolute w-[300px] h-[85vh] top-10 right-0 rounded-lg bg-white dark:bg-contentBg border border-gray-200 dark:border-gray-700 shadow-lg p-2 transition-opacity duration-100 ${clicked ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={handleMenuClick}
            >
                {/* 프로필 정보 */}
                <div className="flex items-center border-b pb-3 border-gray-300 dark:border-gray-700">
                    <FiUser className="w-10 h-10 text-gray-700 dark:text-gray-300" />
                    <div className="ml-3">
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">{nickname}</p>
                        <p className="text-sm text-gray-400">0개 | 0개</p>
                    </div>
                </div>
                {/* 메뉴 리스트 */}
                <div className="mt-3 space-y-3">
                    <MenuItem 
                        icon={<FiUser className="text-gray-700 dark:text-gray-300" />} 
                        text="마이페이지"
                        href="/my/info"
                    />
                    <MenuItem 
                        icon={<GrChannel className="text-gray-700 dark:text-gray-300" />} 
                        text="채널" 
                        href="/channel"
                    />
                    <MenuItem 
                        icon={<FiSettings className="text-gray-700 dark:text-gray-300" />} 
                        text="설정" 
                        href="/settings"
                    />
                    <div 
                        className="flex items-center space-x-3 p-2 hover:bg-iconBg dark:hover:bg-iconBg-dark rounded-lg cursor-pointer"
                        onClick={() => handleLogout()}
                    >
                        <BiLogOut className="text-gray-700 dark:text-gray-300" />
                        <span className="text-sm">{"로그아웃"}</span>
                    </div>
                    
                </div>
            </div>
            
        </div>
    );
}

function MenuItem({ icon, text, href }: { icon: JSX.Element; text: string; href: string }) {
    const router = useRouter();
    
    const handleClick = () => {
        router.push(href);
    };
    
    return (
        <div 
            className="flex items-center space-x-3 p-2 hover:bg-iconBg dark:hover:bg-iconBg-dark rounded-lg cursor-pointer"
            onClick={handleClick}
        >
            {icon}
            <span className="text-sm">{text}</span>
        </div>
    );
}
