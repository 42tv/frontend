import Image from "next/image";
import { useState } from "react";

export default function Search() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [searchString, setSearchString] = useState("");
    return (
      <div className="flex flex-row absolute min-w-[100px] w-[calc(100%-660px)] max-w-[440px] left-1/2 -translate-x-1/2 border border-[#69696B] rounded-[15px] focus-within:border-blue-500">
        <div className="flex flex-row w-full h-[36px]">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            className="w-full h-full focus:outline-none px-2 rounded-l-[15px] text-center"
            onChange={(e) => {
              // console.log(e.target.value);
              setSearchString(e.target.value)
            }}
          />
        <button className="block w-[30px] h-full flex items-center justify-center dark:bg-darkBg rounded-r-[15px]">
          <Image src="/icons/search.svg" width={20} height={20} alt="" priority={true}/>
        </button>
        </div>
      </div>
    );
  }
  