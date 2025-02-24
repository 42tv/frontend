import Image from "next/image";
import { UserResponse } from "../../utils/interfaces";
import { useState, useEffect, useRef } from "react";

export default function ProfileIcon({ user }: { user: UserResponse }) {
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
                user.profile_img ? 
                <Image src={user.profile_img} width={30} height={30} alt="profile icon" /> 
                : 
                <Image src="/icons/anonymouse1.svg" width={30} height={30} alt="profile icon" />
            }
            {clicked && (
                <div className="absolute top-10 right-0 rounded-lg shadow-md p-2 " onClick={handleMenuClick}>
                    <ul>
                        <li className="p-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                        <li className="p-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                        <li className="p-2 hover:bg-gray-100 cursor-pointer">Logout</li>
                    </ul>
                </div>
            )}
        </div>
    )
}
