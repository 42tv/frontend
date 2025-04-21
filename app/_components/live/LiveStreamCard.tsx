import Image from "next/image";

// Define interfaces for the data structure (moved from page.tsx)
interface User {
    idx: number;
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
    return (
        <div key={`${live.user_idx}-${live.start_time}`} className="border rounded-lg overflow-hidden shadow-lg">
            <div className="relative w-full h-48"> {/* Container for Image */}
                <Image
                    src={live.thumbnail || DEFAULT_PLACEHOLDER_IMAGE_URL} // Use placeholder if thumbnail is missing
                    alt={live.title}
                    fill // Use fill prop instead of layout="fill"
                    className="object-cover" // Use className for object-fit
                    unoptimized={live.thumbnail?.includes('cloudfront.net')} // Avoid optimization for external URLs if needed
                    priority={index === 0} // Add priority prop for the first image
                />
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">LIVE</span>
                <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    {live.viewerCount}
                </span>
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-lg truncate">{live.title}</h3>
                <div className="flex items-center mt-2">
                    <Image
                        src={live.user.profile_img || DEFAULT_PLACEHOLDER_IMAGE_URL} // Use placeholder if profile_img is missing
                        alt={live.user.nickname}
                        width={24}
                        height={24}
                        className="rounded-full mr-2"
                        unoptimized={live.user.profile_img?.includes('cloudfront.net')}
                    />
                    <span className="text-sm text-gray-600">{live.user.nickname}</span>
                </div>
                {/* Add other details like like_cnt, play_cnt if needed */}
            </div>
        </div>
    );
}

