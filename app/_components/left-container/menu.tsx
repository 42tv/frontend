import NavItem from "./nav-item";
import { BsBroadcastPin } from "react-icons/bs";

export default function Menu() {
    return (
        <div className="flex flex-col">
            <NavItem icon={BsBroadcastPin} label="전체 방송" href="/live" />
        </div>
    )
}