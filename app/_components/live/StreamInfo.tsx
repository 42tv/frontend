'use client';
import { PlayData } from "@/app/_components/utils/interfaces";
import { formatElapsedTimeBySeconds } from "@/app/_components/utils/utils";
import { useEffect, useState } from "react";
import { AiOutlineClockCircle, AiOutlineLike } from "react-icons/ai";
import { FiUser, FiMail } from "react-icons/fi";
import { GiPresent } from "react-icons/gi";
import { MdOutlineBookmark, MdOutlineBookmarkBorder } from "react-icons/md";
import Image from 'next/image';

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

    // 경과 시간 업데이트를 위한 useEffect
    useEffect(() => {
        if (!playDataState?.stream.start_time) {
            setElapsedTime('');
            return;
        }
        
        // 초기 경과 시간 설정
        setElapsedTime(formatElapsedTimeBySeconds(playDataState.stream.start_time));

        // 1초마다 경과 시간 업데이트
        const intervalId = setInterval(() => {
            setElapsedTime(formatElapsedTimeBySeconds(playDataState.stream.start_time));
        }, 1000);
        
        // 컴포넌트 언마운트 시 인터벌 정리
        return () => clearInterval(intervalId);
    }, [playDataState?.stream.start_time]);

    return (
        <div className="flex flex-row w-full p-4 border-t border-border-secondary dark:border-border-secondary-dark flex items-center space-x-4">
            {/* 프로필 이미지 영역 */}
            <div className="flex items-center justify-center space-x-2 min-w-[60px]">
                <Image
                    src={playDataState?.broadcaster.profile_img || "/icons/anonymouse1.svg"}
                    alt="프로필 이미지"
                    width={60}
                    height={60}
                    className="rounded-full"
                />
            </div>
            
            {/* 설명 텍스트 영역 */}
            <div className="flex w-full flex-col">
                <h2 className="text-xl font-semibold">{playDataState?.stream.title}</h2>
                <p className="dark:text-textBase-dark text-textBase">{playDataState?.broadcaster.nickname}</p>
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
