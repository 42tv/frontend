import { useState, useRef, useEffect } from "react";
import { searchUserProfile } from "@/app/_apis/user";
import { getApiErrorMessage } from "@/app/_lib/api";

interface UserInfo {
  user_id: string;
  nickname: string;
  profile_img: string;
}

export const useUserSearch = () => {
  const [searchNickname, setSearchNickname] = useState("");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 외부 클릭 시 popover 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowPopover(false);
      }
    };

    if (showPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopover]);

  const handleSearch = async () => {
    if (!searchNickname.trim()) return;
    
    setSearching(true);
    setNotFound(false);
    setUserInfo(null);
    setShowPopover(true);

    try {
      const userProfile = await searchUserProfile(searchNickname);
      
      setUserInfo({
        user_id: userProfile.user_id,
        nickname: userProfile.nickname,
        profile_img: userProfile.profile_img || ""
      });
    } catch (error: unknown) {
      console.error("사용자 검색 실패:", error);
      
      const errorMessage = getApiErrorMessage(error);
      if (errorMessage && errorMessage.includes("찾을 수 없")) {
        setNotFound(true);
      } else {
        setNotFound(true);
      }
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchNickname("");
    setUserInfo(null);
    setNotFound(false);
    setSearching(false);
    setShowPopover(false);
  };

  const handleInputFocus = () => {
    if (userInfo || notFound || searching) {
      setShowPopover(true);
    }
  };

  return {
    searchNickname,
    setSearchNickname,
    userInfo,
    searching,
    notFound,
    showPopover,
    setShowPopover,
    popoverRef,
    inputRef,
    handleSearch,
    clearSearch,
    handleInputFocus
  };
};

export type { UserInfo };