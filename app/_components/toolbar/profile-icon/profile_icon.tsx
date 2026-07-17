import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/_lib/stores"
import { FiUser, FiSettings, FiMessageSquare } from "react-icons/fi";
import { useUnreadInquiry } from "@/app/_hooks/useUnreadInquiry";
import { useUnreadPosts } from "@/app/_hooks/useUnreadPosts";
import { BiLogOut } from "react-icons/bi";
import { logout } from "@/app/_apis/user";
import { GrChannel } from "react-icons/gr";
import { StarCoinIcon, PostIcon, DefaultAvatar } from "@/app/_components/icons";

export default function ProfileIcon() {
    const router = useRouter();
    const profile_img = useUserStore((state) => state.profile_img);
    const nickname = useUserStore((state) => state.nickname) || "Guest";
    const coin = useUserStore((state) => state.coin);
    const { count: unreadInquiryCount } = useUnreadInquiry();
    const { count: unreadPostCount } = useUnreadPosts();
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
                <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                    <Image src={profile_img} width={40} height={40} alt="profile icon" priority={true} className="w-full h-full object-cover" />
                </div>
                
            ) : (
                <DefaultAvatar size={40} />
            )}
            {unreadInquiryCount + unreadPostCount > 0 && (
                <span className="absolute top-0 right-0 w-[10px] h-[10px] rounded-full bg-red-500 border-2 border-bg-primary" />
            )}
            <div
                className={`absolute w-[300px] h-[85vh] top-10 right-0 rounded-lg bg-bg-secondary border border-border-primary shadow-lg p-2 transition-opacity duration-100 z-10 ${clicked ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={handleMenuClick}
            >
                {/* 프로필 정보 */}
                <div className="border-b pb-3 border-border-primary">
                    <div className="flex items-center">
                        <FiUser className="w-10 h-10 text-accent" />
                        <p className="ml-3 text-lg font-semibold text-text-primary truncate">{nickname}</p>
                    </div>
                    <div className="mt-3 flex items-stretch rounded-lg border border-border-primary divide-x divide-border-primary overflow-hidden">
                        <button
                            type="button"
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 hover:bg-bg-tertiary transition-colors"
                            onClick={() => router.push("/my/gift")}
                        >
                            <StarCoinIcon size={18} className="shrink-0" />
                            <span className="text-sm font-medium text-text-primary">
                                {(coin?.balance ?? 0).toLocaleString()}
                            </span>
                        </button>
                        <button
                            type="button"
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 hover:bg-bg-tertiary transition-colors"
                            onClick={() => router.push("/my/post")}
                        >
                            <PostIcon size={16} className="shrink-0 text-text-secondary" />
                            <span className="text-sm font-medium text-text-primary">
                                {unreadPostCount > 99 ? '99+' : unreadPostCount}
                            </span>
                        </button>
                    </div>
                </div>
                {/* 메뉴 리스트 */}
                <div className="mt-3 space-y-3">
                    <MenuItem
                        icon={<FiUser className="text-text-secondary" />}
                        text="마이페이지"
                        href="/my/info"
                    />
                    <MenuItem
                        icon={<GrChannel className="text-text-secondary" />}
                        text="채널"
                        href="/channel"
                    />
                    <MenuItem
                        icon={<PostIcon size={16} className="text-text-secondary" />}
                        text="쪽지함"
                        href="/my/post"
                        badge={unreadPostCount}
                    />
                    <MenuItem
                        icon={<FiMessageSquare className="text-text-secondary" />}
                        text="1:1 문의"
                        href="/my/inquiry"
                        badge={unreadInquiryCount}
                    />
                    <MenuItem
                        icon={<FiSettings className="text-text-secondary" />}
                        text="설정"
                        href="/settings"
                    />
                    <div
                        className="flex items-center space-x-3 p-2 hover:bg-bg-tertiary rounded-lg cursor-pointer transition-colors"
                        onClick={() => handleLogout()}
                    >
                        <BiLogOut className="text-text-secondary" />
                        <span className="text-sm text-text-secondary">{"로그아웃"}</span>
                    </div>

                </div>
            </div>
            
        </div>
    );
}

function MenuItem({ icon, text, href, badge }: { icon: JSX.Element; text: string; href: string; badge?: number }) {
    const router = useRouter();

    const handleClick = () => {
        router.push(href);
    };

    return (
        <div
            className="flex items-center space-x-3 p-2 hover:bg-bg-tertiary rounded-lg cursor-pointer transition-colors"
            onClick={handleClick}
        >
            {icon}
            <span className="text-sm text-text-secondary">{text}</span>
            {badge !== undefined && badge > 0 && (
                <span className="ml-auto min-w-[20px] h-[20px] px-1.5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-semibold">
                    {badge > 99 ? '99+' : badge}
                </span>
            )}
        </div>
    );
}
