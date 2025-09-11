"use client";

import React from "react";
import { useUserSearch } from "./UserSearchSection/useUserSearch";
import SearchInput from "./UserSearchSection/SearchInput";
import SearchResultPopover from "./UserSearchSection/SearchResultPopover";

interface UserSearchSectionProps {
  onBlockUser: (userId: string) => Promise<void>;
  isLoading: boolean;
}

export const UserSearchSection: React.FC<UserSearchSectionProps> = ({
  onBlockUser,
  isLoading,
}) => {
  const {
    searchNickname,
    setSearchNickname,
    userInfo,
    searching,
    notFound,
    showPopover,
    popoverRef,
    inputRef,
    handleSearch,
    clearSearch,
    handleInputFocus
  } = useUserSearch();

  const handleBlock = async () => {
    if (userInfo) {
      await onBlockUser(userInfo.user_id);
      clearSearch();
    }
  };

  return (
    <div className="p-4 rounded-lg transition-colors" style={{ backgroundColor: 'var(--bg-300)', border: '1px solid var(--bg-300)' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--bg-200)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--bg-300)'}>
      <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-100)' }}>사용자 차단</h3>
      
      <div className="relative" ref={popoverRef}>
        <SearchInput 
          searchNickname={searchNickname}
          searching={searching}
          userInfo={userInfo}
          notFound={notFound}
          inputRef={inputRef}
          onSearchChange={setSearchNickname}
          onSearch={handleSearch}
          onClearSearch={clearSearch}
          onInputFocus={handleInputFocus}
        />

        <SearchResultPopover 
          showPopover={showPopover}
          userInfo={userInfo}
          searching={searching}
          notFound={notFound}
          isLoading={isLoading}
          onBlockUser={handleBlock}
        />
      </div>
    </div>
  );
};
