import React from 'react';

interface SearchBarProps {
    searchValue: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
    searchValue,
    onSearchChange
}) => {
    return (
        <div className="flex flex-row my-5 mx-5 justify-end">
            <div className="flex space-x-2">
                <input
                    className="w-[200px] h-[40px] rounded-[8px] border focus:outline-none pl-2
                     border-borderButton1 dark:border-borderButton1-dark 
                     placeholder-textSearch dark:placeholder-textSearch-dark"
                    placeholder="아이디를 입력하세요"
                    value={searchValue}
                    onChange={onSearchChange}
                />
            </div>
        </div>
    );
};

export default SearchBar;