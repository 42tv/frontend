'use client';
import { useEffect, useState } from "react";
import LiveStreamCard, { Live } from "../_components/live/LiveStreamCard";
import { getLiveList } from "../_apis/live";

export default function LivePage() {
    const [lives, setLives] = useState<Live[]>([]); // State to store live streams

    useEffect(() => {
        async function fetchLiveList() {
            try {
                const response = await getLiveList();
                const fetchedLives = response.lives; // API 응답에서 lives 배열 가져오기

                // lives 배열을 5번 반복하여 새로운 배열 생성
                const multipliedLives = Array.from({ length: 5 }).flatMap(() => fetchedLives);

                // Assuming the API returns the structure { lives: Live[] }
                setLives(multipliedLives); // 5배로 늘린 lives 배열로 상태 업데이트
            } catch (error) {
                console.error("Error fetching live list:", error);
            }
        }
        fetchLiveList();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 overflow-x-hidden">
            <h1 className="text-2xl font-bold mb-6">Live Streams</h1>
            {lives.length > 0 ? (
                <div className="grid gap-4 grid-cols-4 lg:grid-cols-5"> {/* <--- grid-cols-4 lg:grid-cols-5 로 수정 */}
                    {lives.map((live, index) => ( // Pass live and index to the new component
                       <LiveStreamCard key={`${live.user_idx}-${live.start_time}-${index}`} live={live} index={index} /> // key에 index 추가하여 고유성 보장
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No live streams available right now.</p>
            )}
        </div>
    );
}