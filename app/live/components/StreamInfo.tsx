'use client';
import { PlayData } from "@/app/_types";
import { formatElapsedTime } from "@/app/_lib/utils";
import { useEffect, useState } from "react";
import { AiOutlineClockCircle, AiOutlineLike } from "react-icons/ai";
import { FiUser, FiMail } from "react-icons/fi";
import { GiPresent } from "react-icons/gi";
import { MdOutlineBookmark, MdOutlineBookmarkBorder } from "react-icons/md";
import Image from 'next/image';
import { openPopupModal } from '@/app/_components/utils/overlay/overlayHelpers';
import { useRouter } from 'next/navigation';

interface StreamInfoProps {
    playDataState: PlayData | null | undefined;
    onToggleBookmark: () => void;
    onSendPost: () => void;
    onRecommend: () => void;
}

export default function StreamInfo({ 
    playDataState, 
    onToggleBookmark, 
    onSendPost, 
    onRecommend 
}: StreamInfoProps) {
    const [elapsedTime, setElapsedTime] = useState<string>('');
    const router = useRouter();

    // 경과 시간 업데이트를 위한 useEffect
    useEffect(() => {
        if (!playDataState?.stream.start_time) {
            setElapsedTime('');
            return;
        }
        
        // 초기 경과 시간 설정
        setElapsedTime(formatElapsedTime(playDataState.stream.start_time, true));

        // 1초마다 경과 시간 업데이트
        const intervalId = setInterval(() => {
            setElapsedTime(formatElapsedTime(playDataState.stream.start_time, true));
        }, 1000);
        
        // 컴포넌트 언마운트 시 인터벌 정리
        return () => clearInterval(intervalId);
    }, [playDataState?.stream.start_time]);

    const handleImageClick = () => {
        const imageUrl = playDataState?.broadcaster.profile_img || "/icons/anonymouse1.svg";
        const ImageWrapper = ({ closeModal, ...props }: any) => <Image {...props} />;
        
        openPopupModal(
                <ImageWrapper
                    src={imageUrl}
                    alt="프로필 이미지 확대"
                    width={400}
                    height={400}
                    className="rounded-lg object-contain"
                />
        );
    };

    const handleNicknameClick = () => {
        if (playDataState?.broadcaster.user_id) {
            router.push(`/channel/${playDataState.broadcaster.user_id}`);
        }
    };

    return (
        <div className="flex flex-row w-full p-4 border-t border-border-secondary dark:border-border-secondary-dark flex items-center space-x-4">
            {/* 프로필 이미지 영역 */}
            <div className="w-[60px] h-[60px] rounded-full overflow-hidden flex-shrink-0">
                <Image
                    src={playDataState?.broadcaster.profile_img || "/icons/anonymouse1.svg"}
                    alt="프로필 이미지"
                    width={60}
                    height={60}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={handleImageClick}
                />
            </div>
            
            {/* 설명 텍스트 영역 */}
            <div className="flex w-full flex-col">
                <h2 className="text-xl font-semibold">{playDataState?.stream.title}</h2>
                <p 
                    className="dark:text-textBase-dark text-textBase cursor-pointer hover:text-primary dark:hover:text-primary-dark transition-colors"
                    onClick={handleNicknameClick}
                >
                    {playDataState?.broadcaster.nickname}
                </p>
                <div className="flex items-center space-x-4 dark:text-textBase-dark text-textBase text-sm mt-1">
                    <span className="flex items-center space-x-1">
                        <FiUser title="시청자" />
                        <span>{playDataState?.viewer_cnt ?? 0}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                        <AiOutlineLike title="추천" />
                        <span>{playDataState?.stream.recommend_cnt ?? 0}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                        <MdOutlineBookmark title="북마크" />
                        <span>{playDataState?.stream.bookmark_cnt ?? 0}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                        <AiOutlineClockCircle />
                        <span>{elapsedTime}</span>
                    </span>
                </div>
            </div>
            
            {/* 아이콘 영역 */}
            <div className="flex items-center justify-end space-x-4 text-text-muted dark:text-text-muted-dark text-2xl">
                <button 
                    title="북마크" 
                    className="hover:text-text-primary dark:hover:text-text-primary-dark transition-colors duration-200"
                    onClick={onToggleBookmark}
                >
                    {playDataState?.user.is_bookmarked ? <MdOutlineBookmark/> : <MdOutlineBookmarkBorder />}
                </button>
                <button 
                    title="쪽지" 
                    className="hover:text-text-primary dark:hover:text-text-primary-dark transition-colors duration-200"
                    onClick={onSendPost}
                >
                    <FiMail />
                </button>
                <button 
                    title="좋아요" 
                    className="hover:text-text-primary dark:hover:text-text-primary-dark transition-colors duration-200"
                    onClick={onRecommend}
                >
                    <AiOutlineLike/>
                </button>
                <button 
                    title="선물" 
                    className="hover:text-text-primary dark:hover:text-text-primary-dark transition-colors duration-200"
                >
                    <GiPresent/>
                </button>
            </div>
        </div>
    );
}
