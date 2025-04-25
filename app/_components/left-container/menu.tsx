import NavItem from "./nav-item";
import { BsBroadcastPin } from "react-icons/bs";
import { FaUserCheck } from "react-icons/fa"; // FaUserCheck 아이콘 임포트

export default function Menu() {
    return (
        <div className="flex flex-col">
            <NavItem icon={BsBroadcastPin} label="전체 방송" href="/live" />
            <NavItem icon={FaUserCheck} label="팔로잉" href="/follow" /> {/* 팔로잉 메뉴 추가 */}
        </div>
    )
}