import Image from "next/image";
// import { EyeIcon, PlayIcon, HeartIcon } from '@heroicons/react/24/solid'; // 아이콘 추가 -> 제거
import { FiHeart, FiUser } from 'react-icons/fi'; // react-icons에서 아이콘 가져오기
import { BsPlayFill } from 'react-icons/bs'; // react-icons에서 아이콘 가져오기
import { useEffect, useState } from 'react'; // useState, useEffect 추가
import { requestPlay } from "@/app/_apis/live";
import usePlayStore from "../utils/store/playStore";
import errorModalStore from "../utils/store/errorModalStore";
import ErrorMessage from "../modals/error_component";
import { getApiErrorMessage } from "@/app/_apis/interfaces";
import { useRouter } from 'next/navigation'; // next/router 대신 next/navigation 사용
import { Live } from "../utils/interfaces";
import { formatElapsedTime } from "../utils/utils";



// Define a default placeholder image URL (moved from page.tsx)
const DEFAULT_PLACEHOLDER_IMAGE_URL = "/placeholder.png"; // Adjust path as needed

interface LiveStreamCardProps {
    live: Live;
    index: number; // Add index prop for priority
}

export default function LiveStreamCard({ live, index }: LiveStreamCardProps) {
    const [elapsedTime, setElapsedTime] = useState(''); // 경과 시간 상태 추가
    const { openError } = errorModalStore()
    const { setPlayData } = usePlayStore()
    const router = useRouter(); // useRouter 훅 사용

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

    async function handlePlay() {
        try {
            const response = await requestPlay(live.user.user_id)
            setPlayData(response);

            router.push(`/live/${live.user.user_id}`); // 재생 페이지로 이동
            
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        catch(e) {
            const message = getApiErrorMessage(e);
            openError(<ErrorMessage message={message} />);
        }
    }

    useEffect(() => {
        setElapsedTime(formatElapsedTime(live.start_time));
    }, []);

    return (
        <div 
            className="flex flex-col rounded-lg overflow-hidden shadow-lg h-full cursor-pointer min-w-[275px]" // max-w-[275px] 제거
            onClick={() => handlePlay()}
        > {/* Link 추가 및 className 이동, cursor-pointer 추가 */}
            <div className="relative w-full aspect-[16/9]">
                <Image
                    src={live.thumbnail || DEFAULT_PLACEHOLDER_IMAGE_URL}
                    alt={live.user.broadcastSetting.title || "Live Stream Thumbnail"}
                    fill // Use fill prop
                    className="object-cover" 
                    priority={true} // Prioritize first few images (adjust as needed)
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
            </div>
            <div className="pt-3 flex flex-col flex-grow"> 
                <h3 className="truncate text-gray-200">{live.user.broadcastSetting.title}</h3> 
                <div className="flex items-center text-sm text-gray-400"> 
                    <span className="truncate flex-grow min-w-0 mr-2">{live.user.nickname}</span>
                    {/* Display viewer, play, and like counts */}
                    <div className="flex items-center text-xs text-gray-500 space-x-2 flex-shrink-0">
                        <span className="flex items-center">
                            <FiUser 
                                className="h-3 w-3 mr-0.5" 
                                title="시청자"
                            />
                            {formatCount(live.viewerCount)}
                        </span>
                        <span className="flex items-center">
                            <BsPlayFill 
                                className="h-3 w-3 mr-0.5" 
                                title="재생"
                            />
                            {formatCount(live.play_cnt)}
                        </span>
                        <span className="flex items-center">
                            <FiHeart 
                                className="h-3 w-3 mr-0.5" 
                                title="추천"
                            />
                            {formatCount(live.like_cnt)}
                        </span>
                        <span className="text-xs text-gray-500 flex-shrink-0">{elapsedTime}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

