/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { reCreateStreamKey } from "@/app/_apis/ivs";
import { useState } from "react";
import { FiCopy, FiEye, FiEyeOff, FiCheck } from "react-icons/fi";

export default function BroadcastSettings() {
  const [streamKey, setStreamKey] = useState("sk-12312312");
  const [serverUrl, setServerUrl] = useState("rtmp://rtmp.pandalive.co.kr:1935/app");
  const [broadcastTitle, setBroadcastTitle] = useState("test");
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [isAdultBroadcast, setIsAdultBroadcast] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [broadcastPassword, setBroadcastPassword] = useState("");
  const [isFanBroadcast, setIsFanBroadcast] = useState(false);
  const [fanBroadcastLevel, setFanBroadcastLevel] = useState("브론즈");
  const [showToast, setShowToast] = useState(false);
  const [copiedText, setCopiedText] = useState("");
  const iconSize = 25;

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
      setShowToast(true);  
      // Hide toast after 2 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
      
      console.log(response);
    }
    catch(e) {
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
              value={broadcastTitle} 
              onChange={(e) => setBroadcastTitle(e.target.value)}
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
              checked={isAdultBroadcast}
              onChange={(e) => setIsAdultBroadcast(e.target.checked)}
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
              checked={isFanBroadcast}
              onChange={(e) => setIsFanBroadcast(e.target.checked)}
              className="h-4 w-4 focus:outline-none"
            />
          </div>
          {isFanBroadcast && (
            <div className="flex items-center ml-4 space-x-3">
              {[
                {value: '브론즈', label: '브론즈'}, 
                {value: '실버', label: '실버'}, 
                {value: '골드', label: '골드'}, 
                {value: '플레티넘', label: '플레티넘'}, 
                {value: '다이아', label: '다이아'}
              ].map((level) => (
                <label key={level.value} className="flex items-center">
                  <input
                    type="radio"
                    name="fanBroadcastLevel"
                    value={level.value}
                    checked={fanBroadcastLevel === level.value}
                    onChange={(e) => setFanBroadcastLevel(e.target.value)}
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
              checked={hasPassword}
              onChange={(e) => setHasPassword(e.target.checked)}
              className="h-4 w-4 focus:outline-none"
            />
          </div>
          <div className="flex col-span-4 items-center ml-4 space-x-2 h-full">
            {hasPassword ? (
              <div className="flex h-[40px] border items-center border-1 px-2 py-1 rounded-md">
                <input 
                  type="password"
                  value={broadcastPassword}
                  onChange={(e) => setBroadcastPassword(e.target.value)}
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
            // Handle saving broadcast settings
            console.log('Saving broadcast settings:', {
              streamKey,
              serverUrl,
              broadcastTitle,
              isAdultBroadcast,
              isFanBroadcast,
              fanBroadcastLevel,
              hasPassword,
              broadcastPassword
            });
            // Here you would typically make an API call to save the settings
            
            // Show success toast
            setCopiedText("설정");
            setShowToast(true);
            setTimeout(() => {
              setShowToast(false);
            }, 2000);
          }}
        >
          저장하기
        </button>
      </div>
    </div>
  );
}
