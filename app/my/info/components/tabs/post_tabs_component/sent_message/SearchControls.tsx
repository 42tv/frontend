import React from 'react';
import { MdDelete } from "react-icons/md";

interface SearchControlsProps {
    searchNickname: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDeletePosts: () => Promise<void>;
}

const SearchControls: React.FC<SearchControlsProps> = ({
    searchNickname,
    onSearchChange,
    onDeletePosts
}) => {
    return (
        <div className="flex flex-row my-5 mx-5 justify-between">
            <div className="flex space-x-2">
                <button 
                    className="flex flex-row w-[95px] h-[40px] rounded-[8px] items-center space-x-1 justify-center border
                    border-borderButton1 dark:border-borderButton1-dark hover:bg-colorFg01"
                    onClick={onDeletePosts}
                >
                    <MdDelete className="text-iconBg-dark"/>
                    <span>삭제</span>
                </button>
            </div>
            <div className="flex space-x-2">
                <input
                    className="w-[200px] h-[40px] rounded-[8px] border focus:outline-none pl-2
                     border-borderButton1 dark:border-borderButton1-dark 
                     placeholder-textSearch dark:placeholder-textSearch-dark"
                    placeholder="아이디를 입력하세요"
                    value={searchNickname}
                    onChange={onSearchChange}
                />
            </div>
        </div>
    );
};

export default SearchControls;