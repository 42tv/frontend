import React from 'react';
import { FaCheck } from 'react-icons/fa'; // FaCheck 아이콘 임포트
import Image from 'next/image'; // Image 컴포넌트 임포트

interface CardItemProps {
  imageUrl: string;
  title: string;
  isLive?: boolean;
  isEditing: boolean; // isEditing prop 추가
  isSelected: boolean; // isSelected prop 추가
  onClick: () => void; // onClick 핸들러 prop 추가
}

const CardItem: React.FC<CardItemProps> = ({
  imageUrl,
  title,
  isLive = false,
  isEditing, // isEditing prop 받기
  isSelected, // isSelected prop 받기
  onClick, // onClick 핸들러 받기
}) => (
  // group 클래스 추가하여 하위 요소에서 group-hover 사용 가능하게 함
  // 편집 모드일 때만 onClick 핸들러 활성화
  // w-[250px] 추가
  <div
    className={`flex flex-col relative rounded-lg overflow-hidden group ${isEditing ? 'cursor-pointer' : ''} w-[250px] `} // 배경색 및 flex-col 추가
    onClick={isEditing ? onClick : undefined} // 편집 모드일 때만 클릭 가능
  >
    {/* 편집 모드일 때만 보이는 오버레이 */}
    {isEditing && (
      <div className={`absolute inset-0 bg-black flex items-center justify-center transition-opacity duration-200 z-10 ${isSelected ? 'bg-opacity-50 opacity-100' : 'bg-opacity-0 group-hover:bg-opacity-50 opacity-0 group-hover:opacity-100'}`}>
        <div className={`bg-white rounded-full w-8 h-8 flex items-center justify-center ${isSelected ? '' : 'opacity-0 group-hover:opacity-100'}`}>
          {/* 선택 상태에 따라 아이콘 색상 변경 */}
          <FaCheck className={`${isSelected ? 'text-green-500' : 'text-gray-400'} text-lg`} />
        </div>
      </div>
    )}

    {/* 기존 LIVE 배지 */}
    {/* 편집 모드 중이거나 라이브 상태일 때 표시 */}
    {isLive && !isEditing && (
      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">
        LIVE
      </span>
    )}
    {/* Image 컴포넌트 사용 */}
    {/* h-36 대신 aspect-[16/9] 사용 */}
    <div className="relative w-full aspect-[16/9]"> {/* Image fill 사용을 위한 부모 요소 */}
      <Image
        src={imageUrl || '/icons/anonymouse1.svg'} // 기본 이미지 URL 설정
        alt={title}
        fill // fill prop 추가
        style={{ objectFit: 'cover' }} // object-cover 스타일 적용
        className="object-cover" // rounded-t-lg 제거 (부모에서 overflow-hidden 처리)
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" // sizes 최적화
      />
    </div>
    <div className="pt-2"> {/* flex-grow 추가 */}
      {/* truncate 추가 */}
      <h3 className="truncate">{title}</h3>
    </div>
  </div>
);

export default CardItem;
