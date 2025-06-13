'use client';
import { useEffect, useState } from "react";
import LiveStreamCard from "../_components/live/LiveStreamCard";
import { getLiveList } from "../_apis/live";
import { Live } from "../_components/utils/interfaces";

export default function LivePage() {
    const [lives, setLives] = useState<Live[]>([]);

    useEffect(() => {
        async function fetchLiveList() {
            try {
                const response = await getLiveList();
                const fetchedLives = response.lives;
                console.log(fetchedLives)

                const multipliedLives = Array.from({ length: 5 }).flatMap(() => fetchedLives);
                // const multipliedLives = [fetchedLives[0]]
                setLives(multipliedLives);
            } catch (error) {
                console.error("Error fetching live list:", error);
            }
        }
        fetchLiveList();
    }, []);

    return (
        <div className="p-4 bg-background dark:bg-background-dark min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Live Streams</h1>
            {lives.length > 0 ? (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(275px,1fr))] gap-4 justify-start">
                    {lives.map((live, index) => (
                        <LiveStreamCard key={index} live={live} index={index} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-text-secondary dark:text-text-secondary-dark">No live streams available right now.</p>
            )}
        </div>
    );
}
