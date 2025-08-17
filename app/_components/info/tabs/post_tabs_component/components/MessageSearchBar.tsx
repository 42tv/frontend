interface MessageSearchBarProps {
  searchNickname: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function MessageSearchBar({ searchNickname, onSearchChange }: MessageSearchBarProps) {
  return (
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
  );
}