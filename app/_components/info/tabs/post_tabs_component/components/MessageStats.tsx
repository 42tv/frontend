interface MessageStatsProps {
  searchNickname: string;
  postsToShowLength: number;
  totalPostsLength: number;
}

export default function MessageStats({ searchNickname, postsToShowLength, totalPostsLength }: MessageStatsProps) {
  return (
    <div className="mb-2">
      <span className="text-textBase">
        {searchNickname ? '검색 결과' : '총 게시물'} :
      </span>
      <span className="font-semibold">
        {postsToShowLength}
      </span>
      <span className="text-textBase">
        건
      </span>
      {searchNickname && (
        <span className="text-textBase ml-2">
          (전체 {totalPostsLength}건 중)
        </span>
      )}
    </div>
  );
}