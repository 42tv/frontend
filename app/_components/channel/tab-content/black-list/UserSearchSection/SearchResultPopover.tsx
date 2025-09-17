import React from 'react';
import { UserInfo } from './useUserSearch';
import LoadingState from './LoadingState';
import NotFoundState from './NotFoundState';
import UserInfoCard from './UserInfoCard';

interface SearchResultPopoverProps {
  showPopover: boolean;
  userInfo: UserInfo | null;
  searching: boolean;
  notFound: boolean;
  isLoading: boolean;
  onBlockUser: () => void;
}

const SearchResultPopover: React.FC<SearchResultPopoverProps> = ({
  showPopover,
  userInfo,
  searching,
  notFound,
  isLoading,
  onBlockUser
}) => {
  if (!showPopover || (!userInfo && !notFound && !searching)) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 z-50">
      <div className="rounded-lg shadow-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-300)', border: '1px solid var(--bg-300)' }}>
        {/* 화살표 */}
        <div className="absolute -top-2 left-6 w-4 h-4 transform rotate-45" style={{ backgroundColor: 'var(--bg-300)', borderLeft: '1px solid var(--bg-300)', borderTop: '1px solid var(--bg-300)' }}></div>
        
        <div className="p-4">
          {searching && <LoadingState />}
          {notFound && !searching && <NotFoundState />}
          {userInfo && !searching && (
            <UserInfoCard 
              userInfo={userInfo}
              isLoading={isLoading}
              onBlockUser={onBlockUser}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultPopover;