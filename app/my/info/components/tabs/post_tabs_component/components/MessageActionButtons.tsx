import { LuSettings } from "react-icons/lu";
import { MdDelete } from "react-icons/md";

interface MessageActionButtonsProps {
  onOpenSettings: () => void;
  onDeletePosts: () => void;
}

export default function MessageActionButtons({ onOpenSettings, onDeletePosts }: MessageActionButtonsProps) {
  return (
    <div className="flex space-x-2">
      <button 
        className="flex flex-row w-[95px] h-[40px] rounded-[8px] items-center space-x-1 justify-center border
        border-border-primary dark:border-border-primary-dark hover:bg-bg-hover dark:hover:bg-bg-hover-dark transition-colors"
        onClick={onOpenSettings}
      >
        <LuSettings className="text-icon-primary dark:text-icon-primary-dark"/>
        <span className="text-text-primary dark:text-text-primary-dark">설정</span>
      </button>
      <button 
        className="flex flex-row w-[95px] h-[40px] rounded-[8px] items-center space-x-1 justify-center border
        border-border-primary dark:border-border-primary-dark hover:bg-bg-hover dark:hover:bg-bg-hover-dark transition-colors"
        onClick={onDeletePosts}
      >
        <MdDelete className="text-icon-primary dark:text-icon-primary-dark"/>
        <span className="text-text-primary dark:text-text-primary-dark">삭제</span>
      </button>
    </div>
  );
}