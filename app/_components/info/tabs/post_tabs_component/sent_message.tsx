import PostDetail from "@/app/_components/info/tabs/post_tabs_component/post_detail";
import { openModal } from "@/app/_components/utils/overlay/overlayHelpers";
import { usePosts } from "./sent_message/usePosts";
import { usePagination } from "./sent_message/usePagination";
import SearchControls from "./sent_message/SearchControls";
import PostsCounter from "./sent_message/PostsCounter";
import PostsTable from "./sent_message/PostsTable";
import Pagination from "./sent_message/Pagination";
import SendMessageButton from "./sent_message/SendMessageButton";
import { useState, useEffect } from "react";

export default function ReceiveMessage() {
    const {
        posts,
        filteredPosts,
        selectedPosts,
        searchNickname,
        handleSearchChange,
        handleSelectPost,
        handleDeletePosts,
        deleteSinglePost,
        setSelectedPosts
    } = usePosts();

    const [isChecked, setIsChecked] = useState(false);
    
    // Determine which posts to show
    const postsToShow = searchNickname ? filteredPosts : posts;
    
    const pagination = usePagination({ 
        totalItems: postsToShow.length,
        itemsPerPage: 10,
        pageSetSize: 5
    });

    // Get current page posts
    const currentPosts = postsToShow.slice(
        pagination.indexOfFirstItem, 
        pagination.indexOfLastItem
    );

    // Reset pagination when search changes
    useEffect(() => {
        pagination.resetToFirstPage();
    }, [searchNickname, pagination]);

    // Handle search with pagination reset
    const handleSearchWithReset = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleSearchChange(e);
        pagination.resetToFirstPage();
    };

    const showSendPostModal = async (
        userId: string, 
        nickname: string, 
        message: string, 
        sentAt: string, 
        postId: number, 
        senderIdx: number
    ) => {
        openModal(
            <PostDetail 
                userId={userId} 
                nickname={nickname} 
                message={message} 
                sentAt={sentAt} 
                postId={postId} 
                deleteSinglePost={deleteSinglePost}
                senderIdx={senderIdx}
            />
        );
    };

    const handleCheckedMaster = () => {
        if (!isChecked) {
            setIsChecked(true);
            setSelectedPosts(currentPosts.map(post => post.id));
        } else {
            setIsChecked(false);
            setSelectedPosts([]);
        }
    };

    return (
        <div className="mb-20">
            <SearchControls
                searchNickname={searchNickname}
                onSearchChange={handleSearchWithReset}
                onDeletePosts={handleDeletePosts}
            />
            
            <div className="p-4">
                <PostsCounter
                    searchNickname={searchNickname}
                    filteredCount={postsToShow.length}
                    totalCount={posts.length}
                />
                
                <PostsTable
                    posts={currentPosts}
                    selectedPosts={selectedPosts}
                    isAllSelected={isChecked}
                    onSelectPost={handleSelectPost}
                    onSelectAll={handleCheckedMaster}
                    onShowPostModal={showSendPostModal}
                />
                
                {/* Pagination Controls */}
                {postsToShow.length > 10 && (
                    <Pagination
                        currentPage={pagination.currentPage}
                        currentSet={pagination.currentSet}
                        lastSet={pagination.lastSet}
                        startPage={pagination.startPage}
                        endPage={pagination.endPage}
                        onPageChange={pagination.paginate}
                        onSetChange={pagination.navigateToSet}
                    />
                )}
            </div>
            
            <SendMessageButton />
        </div>
    );
}