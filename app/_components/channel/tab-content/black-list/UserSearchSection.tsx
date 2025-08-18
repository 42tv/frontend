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
    <div className="bg-gray-800 dark:bg-gray-800 p-4 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors">
      <h3 className="text-lg font-medium text-white mb-4">사용자 차단</h3>
      
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
