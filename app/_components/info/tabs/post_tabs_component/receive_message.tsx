import { LuSettings } from "react-icons/lu";
import { MdDelete } from "react-icons/md";

export default function ReceiveMessage() {
    return (
        <div className="flex flex-row my-5 mx-5 space-x-2">
            <button 
                className="flex flex-row w-[95px] h-[40px] rounded-[8px] items-center space-x-1 justify-center border
                border-borderLightButton1 dark:border-borderDarkButton1 hover:bg-colorFg01">
                <LuSettings className="text-iconDarkBg"/>
                <span>설정</span>
            </button>
            <button 
                className="flex flex-row w-[70px] h-[40px] rounded-[8px] items-center space-x-1 justify-center border
                border-borderLightButton1 dark:border-borderDarkButton1 hover:bg-colorFg01">
                <MdDelete className="text-iconDarkBg"/>
                <span>삭제</span>
            </button>
        </div>
    )
}