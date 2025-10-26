'use client';

import React from 'react';

interface SponModalProps {
    closeModal?: () => void;
}

const SponModal: React.FC<SponModalProps> = () => {
    return (
        <div className="bg-[#2a2a2a] rounded-lg w-[400px] overflow-hidden">
            {/* Header */}
            <div className="relative px-6 py-4 border-b border-[#3a3a3a]">
                <h2 className="text-lg font-semibold text-white">
                    후원
                </h2>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Image Grid Area - Empty for now */}
                <div className="grid grid-cols-3 gap-3 mb-6 min-h-[300px] bg-[#1a1a1a] rounded-lg p-4">
                    <div className="col-span-3 flex items-center justify-center text-gray-500">
                        {/* Placeholder for heart items */}
                    </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    <button className="text-gray-400 hover:text-white">
                        &lt;
                    </button>
                    <span className="text-sm text-white">
                        1 / 6
                    </span>
                    <button className="text-gray-400 hover:text-white">
                        &gt;
                    </button>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-[#3a3a3a] pt-4 mb-6">
                    <div className="bg-[#1a1a1a] rounded-lg p-4">
                        <div className="flex items-center justify-between text-sm text-white">
                            <span>코인</span>
                            <input
                                type="text"
                                defaultValue="0"
                                className="bg-[#3a3a3a] text-white px-3 py-1 rounded text-right w-24 border border-[#4a4a4a] focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button className="flex-1 py-3 rounded-lg bg-gray-600 text-white font-medium hover:bg-gray-500 transition-colors">
                        하트선물목수
                    </button>
                    <button className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors">
                        선물하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SponModal;
