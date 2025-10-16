import React from 'react';

interface PostsCounterProps {
    searchNickname: string;
    filteredCount: number;
    totalCount: number;
}

const PostsCounter: React.FC<PostsCounterProps> = ({
    searchNickname,
    filteredCount,
    totalCount
}) => {
    return (
        <div className="mb-2">
            <span className="text-textBase">
                {searchNickname ? '검색 결과' : '총 게시물'} :
            </span>
            <span className="font-semibold">
                {filteredCount}
            </span>
            <span className="text-textBase">
                건
            </span>
            {searchNickname && (
                <span className="text-textBase ml-2">
                    (전체 {totalCount}건 중)
                </span>
            )}
        </div>
    );
};

export default PostsCounter;