import NavItem from "./nav-item";
import VideoIcon from "./video-icon";

export default function Menu() {
    return (
        <div className="flex flex-col ">
            <NavItem icon={VideoIcon} label="전체 방송" />
        </div>
    )
}