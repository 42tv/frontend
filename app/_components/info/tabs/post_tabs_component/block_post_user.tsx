import React, { useState } from "react";
import { useBlockedUsers } from "./block_post_user/useBlockedUsers";
import SearchBar from "./block_post_user/SearchBar";
import UserCounter from "./block_post_user/UserCounter";
import BlockedUsersTable from "./block_post_user/BlockedUsersTable";
import Pagination from "./block_post_user/Pagination";
import UnblockButton from "./block_post_user/UnblockButton";

export default function BlockPostUser() {
    const {
        blockedUser,
        filteredUsers,
        selectedUsers,
        searchNickname,
        handleSearchChange,
        handleSelectUser,
        removeBlockedUsers,
        removeBlockedUser,
        setSelectedUsers
    } = useBlockedUsers();
    
    const [currentPage, setCurrentPage] = useState(1);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const postsPerPage = 10;
    const pageSetSize = 5;
    
    // Calculate the users to display on current page
    const usersToShow = searchNickname ? filteredUsers : blockedUser;
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentUsers = usersToShow.slice(indexOfFirstPost, indexOfLastPost);
    
    // Calculate total pages
    const totalPages = Math.ceil(usersToShow.length / postsPerPage);

    const handleSelectAll = () => {
        if (!isAllSelected) {
            setIsAllSelected(true);
            setSelectedUsers(currentUsers.map(user => user.blocked.idx));
        } else {
            setIsAllSelected(false);
            setSelectedUsers([]);
        }
    };

    const handleUnblockUsers = async () => {
        const result = await removeBlockedUsers();
        if (result.success) {
            setIsAllSelected(false);
        }
    };

    return (
        <div className="mb-20">
            <SearchBar 
                searchValue={searchNickname}
                onSearchChange={handleSearchChange}
            />
            
            <div className="p-4">
                <UserCounter 
                    searchNickname={searchNickname}
                    filteredCount={usersToShow.length}
                    totalCount={blockedUser.length}
                />
                
                <BlockedUsersTable 
                    users={currentUsers}
                    selectedUsers={selectedUsers}
                    isAllSelected={isAllSelected}
                    onSelectUser={handleSelectUser}
                    onSelectAll={handleSelectAll}
                    onRemoveUser={removeBlockedUser}
                />
                
                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    postsPerPage={postsPerPage}
                    totalUsers={usersToShow.length}
                    pageSetSize={pageSetSize}
                    onPageChange={setCurrentPage}
                />
            </div>
            
            <UnblockButton 
                selectedUsers={selectedUsers}
                onUnblock={handleUnblockUsers}
            />
        </div>
    );
}