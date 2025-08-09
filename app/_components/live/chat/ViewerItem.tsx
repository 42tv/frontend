'use client';
import React from 'react';
import { Viewer } from '@/app/_types';

interface ViewerItemProps {
    viewer: Viewer;
    onClick: (viewer: Viewer) => void;
}

const ViewerItem: React.FC<ViewerItemProps> = ({ viewer, onClick }) => {
    return (
        <div 
            onClick={() => onClick(viewer)}
            className="cursor-pointer hover:bg-bg-tertiary dark:hover:bg-bg-tertiary-dark p-2 rounded transition-colors duration-150"
        >
            <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                    {viewer.profile_img ? (
                        <img 
                            src={viewer.profile_img} 
                            alt={viewer.nickname}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div 
                            className="w-full h-full flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: '#6B7280' }}
                        >
                            {viewer.grade.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1">
                        <span className="font-semibold text-text-primary dark:text-text-primary-dark">
                            {viewer.nickname}
                        </span>
                        {viewer.role === 'broadcaster' && (
                            <span className="text-xs bg-red-500 text-white px-1 rounded">방송자</span>
                        )}
                        {viewer.role === 'manager' && (
                            <span className="text-xs bg-blue-500 text-white px-1 rounded">매니저</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewerItem;
