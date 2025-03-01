import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import useUserStore from "../../utils/store/userStore";

export default function ProfileIcon() {
    const nickname = useUserStore((state) => state.nickname);
    const profile_img = useUserStore((state) => state.profile_img);
    const [clicked, setClicked] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    function toggleClick() {
        setClicked((prev) => !prev);
    }

    function handleMenuClick(event: React.MouseEvent) {
        event.stopPropagation(); // 메뉴 내부 클릭 시 이벤트 전파 중단
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
            className="relative bg-white rounded-full mr-4"
            onClick={toggleClick}
            ref={menuRef}
        >
            {
                profile_img ? 
                <Image src={profile_img} width={30} height={30} alt="profile icon" /> 
                : 
                <Image src="/icons/anonymouse1.svg" width={30} height={30} alt="profile icon" priority={true}/>
            }
            {clicked && (
                <div className="absolute w-[300px] h-[85vh] top-10 right-0 rounded-lg shadow-md p-2 dark:bg-contentBg" onClick={handleMenuClick}>
                    <div className="flex w-full border-b border-[#3b3b3b]">
                        aa
                    </div>
                    <div className="flex w-full border-b border-[#3b3b3b]">
                        bb
                    </div>
                    <div className="flex w-full border-b border-[#3b3b3b]">
                        cc
                    </div>
                </div>
            )}
        </div>
    )
}
