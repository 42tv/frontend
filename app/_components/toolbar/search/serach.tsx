import { useState } from "react";

export default function Search() {
    const [searchString, setSearchString] = useState("");
    return (
      <div className="flex flex-row absolute min-w-[100px] max-w-[400px] left-1/2 -translate-x-1/2 border border-[#69696B] rounded-[20px] focus-within:border-blue-500">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          className="w-[200px] h-[36px] px-2 focus:outline-none rounded-l-[20px]"
          onChange={(e) => setSearchString(e.target.value)}
        />
        {
            searchString.length > 0 && (
                <button className="w-[30px] h-[36px] bg-[#69696B] flex items-center justify-center">
                  ?
                </button>
            )
        }
        <button className="w-[30px] h-[36px] bg-[#69696B] flex items-center justify-center rounded-r-[20px]">
          🔍
        </button>
      </div>
    );
  }
  