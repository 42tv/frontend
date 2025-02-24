import Image from "next/image";
import { useState } from "react";

export default function Search() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [searchString, setSearchString] = useState("");
    return (
      <div className="flex flex-row absolute min-w-[100px] w-[calc(100%-660px)] max-w-[440px] left-1/2 -translate-x-1/2 border border-[#69696B] rounded-[5px] focus-within:border-blue-500">
        <div className="flex flex-row w-full h-[36px] rounded-l-[20px]">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            className="w-full h-full focus:outline-none rounded-l-[20px] px-2"
            onChange={(e) => {
              // console.log(e.target.value);
              setSearchString(e.target.value)
            }}
          />

        </div>
       
        
        <button className="w-[30px] h-[36px] flex items-center justify-center rounded-r-[5px]">
          <Image src="icons/search.svg" width={20} height={20} alt="" priority={true}/>
        </button>
      </div>
    );
  }
  