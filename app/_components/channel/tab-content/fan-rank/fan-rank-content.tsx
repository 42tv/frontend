import React from "react";

export const FanRankContent = () => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="font-bold text-xl mb-4">팬 등급</h3>
      <div className="space-y-2">
        {[1, 2, 3].map((rank) => (
          <div key={rank} className="bg-gray-700 p-4 rounded flex items-center">
            <span className="font-bold text-lg mr-4">{rank}</span>
            <div className="w-10 h-10 bg-gray-600 rounded-full mr-3"></div>
            <div>
              <p className="font-medium">닉네임{rank}</p>
              <p className="text-sm text-gray-400">포인트: {1000 - (rank * 100)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
