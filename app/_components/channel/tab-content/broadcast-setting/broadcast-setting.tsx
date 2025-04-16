'use client';
import { ErrorResponse } from "@/app/_apis/interfaces";
import { reCreateStreamKey } from "@/app/_apis/ivs";
import { getBroadcastSetting, updateBroadcastSetting } from "@/app/_apis/user";
import ErrorMessage from "@/app/_components/modals/error_component";
import errorModalStore from "@/app/_components/utils/store/errorModalStore";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { FiCopy, FiEye, FiEyeOff, FiCheck } from "react-icons/fi";

export default function BroadcastSettings() {
  const [streamKey, setStreamKey] = useState("");
  const [serverUrl, setServerUrl] = useState("");
  const [title, setTitle] = useState("test");
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [isAdult, setIsAdult] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const [isFanClub, setIsFanClub] = useState(false);
  const [fanLevel, setFanLevel] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [copiedText, setCopiedText] = useState("");
  const { openError } = errorModalStore();
  const iconSize = 25;

  useEffect(() => {
    async function fetchBroadcastSetting() {
      try {
        const response = await getBroadcastSetting();
        setStreamKey(response.ivs.stream_key);
        setServerUrl(response.ivs.ingest_endpoint);
        setTitle(response.broadcastSetting.title);
        setIsAdult(response.broadcastSetting.is_adult);
        setIsPrivate(response.broadcastSetting.is_pw);
        setPassword(response.broadcastSetting.password ?? '');
        setIsFanClub(response.broadcastSetting.is_fan);
        setFanLevel(response.broadcastSetting.fan_level);
        console.log(response);
      } catch (error) {
        console.error("Error fetching broadcast settings:", error);
      }
    }
    fetchBroadcastSetting();
  }, [])

  const toggleStreamKeyVisibility = () => {
    setShowStreamKey(!showStreamKey);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Copied to clipboard');
        setCopiedText(label);
        setShowToast(true);
        
        // Hide toast after 2 seconds
        setTimeout(() => {
          setShowToast(false);
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  async function reissueStreamKey() {
    try {
      const response = await reCreateStreamKey();
      setStreamKey(response.streamKey);
      setCopiedText("스트림키가 변경되었습니다")
      setShowStreamKey(true);
      setShowToast(true);  
      // Hide toast after 2 seconds
      setTimeout(() => {
        setShowToast(false);
        setShowStreamKey(false);
      }, 2000);
      console.log(response);
    }
    catch(e) {
      if (axios.isAxiosError<ErrorResponse>(e)) {
        openError(<ErrorMessage message={e.response!.data.message} />);
      }
    }
  }

  function validateValues() {
    if (title.length < 1 || title.length > 30) {
      openError(<ErrorMessage message="방송 제목은 1자 이상 30자 이하로 입력해주세요" />);
      return false;
    }
    if (isPrivate && (password.length < 4 || password.length > 8)) {
      openError(<ErrorMessage message="비밀번호는 4~8글자로 설정해주세요" />);
      return false;
    }
    if (isFanClub && (fanLevel < 1 || fanLevel > 5)) {
      openError(<ErrorMessage message="팬 레벨은 1~5입니다" />);
      return false;
    }
    return true;
  }

  async function handleSave() {
    if (!validateValues()) {
      return;
    }
    try {
      await updateBroadcastSetting(title, isAdult, isPrivate, isFanClub, fanLevel, password)
    }
    catch(e) {
      openError(<ErrorMessage message="유효하지 않은 설정입니다" />);
      console.error(e);
    }
    

  }

  return (
    <div className="flex flex-col w-full p-4 max-w-3xl relative">
      {/* Toast notification - always in DOM but visibility controlled by opacity */}
      <div 
        className={`fixed top-4 right-4 bg-green-100 border text-green-700 px-4 py-2 rounded flex items-center shadow-md transition-opacity duration-300 ${
          showToast ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <FiCheck className="mr-2" />
        <span>{copiedText}</span>
      </div>
      
      <label className="block mb-2 font-bold text-xl">방송설정</label>
      <div className="grid grid-cols-6 items-center my-2">
        <div className="flex col-span-1 text-center items-center">
            <label className="w-[100px]">스트림키</label>
        </div>
        <div className="flex col-span-4 items-center space-x-2">
            <div className="flex w-full h-[40px] border items-center border-1 px-2 py-1 rounded-md space-x-3">
              <input 
                type={showStreamKey ? "text" : "password"} 
                value={streamKey} 
                readOnly 
                className="flex w-full focus:outline-none"
              />
              {showStreamKey ? (
                <FiEyeOff size={iconSize} onClick={toggleStreamKeyVisibility} className="cursor-pointer" />
              ) : (
                <FiEye size={iconSize} onClick={toggleStreamKeyVisibility} className="cursor-pointer" />
              )}
              <FiCopy size={iconSize} onClick={() => copyToClipboard(streamKey, "스트림키 복사")} className="cursor-pointer" />
            </div>
        </div>
        <div className="flex col-span-1 justify-center items-center">
          <button 
            className="border px-2 py-1 rounded-md"
            onClick={() => reissueStreamKey()}
          >
            재발급
          </button>
        </div>
      </div>
      <div className="grid grid-cols-6 my-2">
        <div className="flex col-span-1 text-center items-center">
            <label className="w-[100px]">서버URL</label>
        </div>
        <div className="flex col-span-5 items-center space-x-2">
          <div className="flex w-full h-[40px] border items-center border-1 px-2 py-1 rounded-md space-x-3">
            <input 
              type="text"
              value={serverUrl} 
              readOnly 
              className="flex w-full focus:outline-none"
            />
            <FiCopy size={iconSize} onClick={() => copyToClipboard(serverUrl, "서버URL 복사")} className="cursor-pointer" />
          </div>
        </div>
      </div>
      
      {/* 방송 제목 */}
      <div className="grid grid-cols-6 my-2">
        <div className="flex col-span-1 text-center items-center">
            <label className="w-[100px]">방송제목</label>
        </div>
        <div className="flex col-span-5 items-center space-x-2">
          <div className="flex w-full h-[40px] border items-center border-1 px-2 py-1 rounded-md space-x-3">
            <input 
              type="text"
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="flex w-full focus:outline-none"
              placeholder="방송 제목을 입력해주세요"
            />
          </div>
        </div>
      </div>

      {/* 방송 속성 */}
      <div className="grid grid-cols-6 my-2">
        <div className="flex col-span-1 text-center items-center">
            <label className="w-[100px]">성인방송</label>
        </div>
        <div className="flex flex-col col-span-5 justify-center">
          {/* 성인방송 */}
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox"
              id="adultBroadcast"
              checked={isAdult}
              onChange={(e) => setIsAdult(e.target.checked)}
              className="h-4 w-4 focus:outline-none"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-6 my-2">
        <div className="flex col-span-1 text-center items-center">
            <label className="w-[100px]">팬방송</label>
        </div>
        <div className="flex col-span-5 items-center">
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox"
              id="fanBroadcast"
              checked={isFanClub}
              onChange={(e) => setIsFanClub(e.target.checked)}
              className="h-4 w-4 focus:outline-none"
            />
          </div>
          {isFanClub && (
            <div className="flex items-center ml-4 space-x-3">
              {[
                {value: 1, label: '브론즈'}, 
                {value: 2, label: '실버'}, 
                {value: 3, label: '골드'}, 
                {value: 4, label: '플레티넘'}, 
                {value: 5, label: '다이아'}
              ].map((level) => (
                <label key={level.value} className="flex items-center">
                  <input
                    type="radio"
                    name="fanBroadcastLevel"
                    value={level.value}
                    checked={fanLevel === level.value}
                    onChange={(e) => setFanLevel(parseInt(e.target.value))}
                    className="h-4 w-4 mr-1 focus:outline-none"
                  />
                  <span>{level.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-6">
        <div className="flex col-span-1 text-center items-center">
            <label className="w-[100px]">비밀번호</label>
        </div>
        <div className="flex col-span-5 items-center h-[40px]">
          <div className="flex col-span-1 items-center space-x-2">
            <input 
              type="checkbox"
              id="hasPassword"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="h-4 w-4 focus:outline-none"
            />
          </div>
          <div className="flex col-span-4 items-center ml-4 space-x-2 h-full">
            {isPrivate ? (
              <div className="flex h-[40px] border items-center border-1 px-2 py-1 rounded-md">
                <input 
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-40 focus:outline-none"
                  placeholder="비밀번호 입력"
                />
              </div>
            ) : (
              <div className="h-[40px] w-[164px]"></div> 
            )}
          </div>
        </div>
      </div>
      
      {/* Save Button */}
      <div className="flex justify-start my-4">
        <button 
          className="bg-color-darkBlue hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-md transition-colors"
          onClick={() => {
            handleSave();
          }}
        >
          저장하기
        </button>
      </div>
    </div>
  );
}
