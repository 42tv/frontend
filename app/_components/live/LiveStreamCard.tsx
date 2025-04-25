import Image from "next/image";
// import { EyeIcon, PlayIcon, HeartIcon } from '@heroicons/react/24/solid'; // 아이콘 추가 -> 제거
import { FiHeart, FiUser } from 'react-icons/fi'; // react-icons에서 아이콘 가져오기
import { BsPlayFill } from 'react-icons/bs'; // react-icons에서 아이콘 가져오기
import { useEffect, useState } from 'react'; // useState, useEffect 추가
import { requestPlay } from "@/app/_apis/live";
import usePlayStore from "../utils/store/playStore";

// Define interfaces for the data structure (moved from page.tsx)
interface User {
    idx: number;
    user_id: string;
    nickname: string;
    profile_img: string;
}

export interface Live { // Export the interface
    user_idx: number;
    thumbnail: string;
    start_time: string;
    title: string;
    is_adult: boolean;
    is_pw: boolean;
    is_fan: boolean;
    fan_level: number;
    play_cnt: number;
    like_cnt: number;
    user: User;
    viewerCount: number;
}

// Define a default placeholder image URL (moved from page.tsx)
const DEFAULT_PLACEHOLDER_IMAGE_URL = "/placeholder.png"; // Adjust path as needed

interface LiveStreamCardProps {
    live: Live;
    index: number; // Add index prop for priority
}

export default function LiveStreamCard({ live, index }: LiveStreamCardProps) {
    const [elapsedTime, setElapsedTime] = useState(''); // 경과 시간 상태 추가
    const { setPlaybackUrl } = usePlayStore()

    // Helper function to format large numbers
    const formatCount = (count: number): string => {
        if (count >= 10000) {
            return (count / 10000).toFixed(1) + '만';
        }
        if (count >= 1000) {
            return (count / 1000).toFixed(1) + '천';
        }
        return count.toString();
    };

    // Helper function to format elapsed time as HH:MM
    const formatElapsedTime = (startTime: string): string => {
        const start = new Date(startTime);
        const now = new Date();
        const diffMs = now.getTime() - start.getTime();

        // Handle cases where start time might be in the future slightly due to clock differences
        if (diffMs < 0) return '00:00';

        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        // Format hours and minutes to always have two digits
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}`;
    };

    async function handlePlay() {
        try {
            const response = await requestPlay();
            setPlaybackUrl(response.playback_url);
            console.log(response);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        catch(e) {
        }
    }

    // Calculate elapsed time on component mount
    useEffect(() => {
        setElapsedTime(formatElapsedTime(live.start_time));
    }, [live.start_time]); // start_time이 변경될 경우에만 재계산 (실제로는 거의 없음)

    return (
        <div 
            className="flex flex-col rounded-lg overflow-hidden shadow-lg h-full cursor-pointer"
            onClick={() => handlePlay()}
        > {/* Link 추가 및 className 이동, cursor-pointer 추가 */}
            <div className="relative w-full aspect-[16/9]">
                <Image
                    src={live.thumbnail || DEFAULT_PLACEHOLDER_IMAGE_URL}
                    alt={live.title}
                    fill // Use fill prop
                    className="object-cover" 
                    priority={index < 4} // Prioritize first few images (adjust as needed)
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
            </div>
            <div className="pt-3 flex flex-col flex-grow"> 
                <h3 className="truncate text-gray-200">{live.title}</h3> 
                <div className="flex items-center text-sm text-gray-400"> 
                    <span className="truncate flex-grow min-w-0 mr-2">{live.user.nickname}</span>
                    {/* Display viewer, play, and like counts */}
                    <div className="flex items-center text-xs text-gray-500 space-x-2 flex-shrink-0">
                        <span className="flex items-center">
                            <FiUser className="h-3 w-3 mr-0.5" />
                            {formatCount(live.viewerCount)}
                        </span>
                        <span className="flex items-center">
                            <BsPlayFill className="h-3 w-3 mr-0.5" />
                            {formatCount(live.play_cnt)}
                        </span>
                        <span className="flex items-center">
                            <FiHeart className="h-3 w-3 mr-0.5" />
                            {formatCount(live.like_cnt)}
                        </span>
                        <span className="text-xs text-gray-500 mr-2 flex-shrink-0">{elapsedTime}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

