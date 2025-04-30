import AuthNavItem from "./AuthNavItem";
import NavItem from "./nav-item";
import { BsBroadcastPin } from "react-icons/bs";
import { RiHeartLine } from "react-icons/ri";


export default function Menu() {
    return (
        <div className="flex flex-col">
            <NavItem icon={BsBroadcastPin} label="전체 방송" href="/live" />
            <AuthNavItem icon={RiHeartLine} label="팔로잉" href="/follow" />
        </div>
    )
}