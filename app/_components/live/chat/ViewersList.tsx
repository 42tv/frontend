'use client';
import React from 'react';
import { Viewer } from '@/app/_types';
import ViewerItem from './ViewerItem';

interface ViewersListProps {
    viewers: Viewer[];
    onViewerClick: (viewer: Viewer) => void;
}

const ViewersList: React.FC<ViewersListProps> = ({ viewers, onViewerClick }) => {
    return (
        <div className="p-3 space-y-2">
            {viewers.length === 0 ? (
                <div className="text-center text-text-muted dark:text-text-muted-dark py-8">
                    시청자가 없습니다.
                </div>
            ) : (
                viewers.map((viewer, index) => (
                    <ViewerItem 
                        key={`${viewer.user_idx}-${index}`}
                        viewer={viewer}
                        onClick={onViewerClick}
                    />
                ))
            )}
        </div>
    );
};

export default ViewersList;
