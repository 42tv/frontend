'use client';
import { useEffect, useState } from "react";
import LiveStreamCard, { Live } from "../_components/live/LiveStreamCard";

export default function LivePage() {
    const [lives, setLives] = useState<Live[]>([]); // State to store live streams

    useEffect(() => {
        async function fetchLiveList() {
            try {
                const response = await fetch("/api/live", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                // Assuming the API returns the structure { lives: Live[] }
                setLives(data.lives); // Set the fetched lives into state
            } catch (error) {
                console.error("Error fetching live list:", error);
            }
        }
        fetchLiveList();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Live Streams</h1>
            {lives.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {lives.map((live, index) => ( // Pass live and index to the new component
                       <LiveStreamCard key={`${live.user_idx}-${live.start_time}`} live={live} index={index} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No live streams available right now.</p>
            )}
        </div>
    );
}