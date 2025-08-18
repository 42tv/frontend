'use client';
import { useBroadcastSettings } from "./components/useBroadcastSettings";
import ToastNotification from "./components/ToastNotification";
import StreamKeyField from "./components/StreamKeyField";
import ServerUrlField from "./components/ServerUrlField";
import TitleField from "./components/TitleField";
import AdultBroadcastField from "./components/AdultBroadcastField";
import FanBroadcastField from "./components/FanBroadcastField";
import PasswordField from "./components/PasswordField";
import SaveButton from "./components/SaveButton";
import HelpText from "./components/HelpText";
import ErrorMessage from "@/app/_components/modals/error_component";
import { openModal } from "@/app/_components/utils/overlay/overlayHelpers";

export default function BroadcastSettings() {
  const {
    streamKey,
    serverUrl,
    title,
    showStreamKey,
    isAdult,
    isPrivate,
    password,
    isFanClub,
    fanLevel,
    showToast,
    copiedText,
    setTitle,
    setIsAdult,
    setIsPrivate,
    setPassword,
    setIsFanClub,
    setFanLevel,
    toggleStreamKeyVisibility,
    copyToClipboard,
    reissueStreamKey,
    handleSave
  } = useBroadcastSettings();

  const handleSaveWithErrorHandling = async () => {
    const result = await handleSave();
    if (result.error) {
      openModal(<ErrorMessage message={result.error} />, { closeButtonSize: "w-[16px] h-[16px]" });
    }
  };

  const handleReissueWithErrorHandling = async () => {
    const result = await reissueStreamKey();
    if (result?.error) {
      openModal(<ErrorMessage message={result.error} />, { closeButtonSize: "w-[16px] h-[16px]" });
    }
  };

  return (
    <div className="bg-gray-900 dark:bg-gray-900 p-6 rounded-lg border border-gray-700 relative">
      <ToastNotification showToast={showToast} copiedText={copiedText} />
      
      <div className="flex flex-col w-full p-4 max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-xl text-white">방송설정</h3>
        </div>
        
        <StreamKeyField
          streamKey={streamKey}
          showStreamKey={showStreamKey}
          onToggleVisibility={toggleStreamKeyVisibility}
          onCopy={copyToClipboard}
          onReissue={handleReissueWithErrorHandling}
        />
        
        <ServerUrlField
          serverUrl={serverUrl}
          onCopy={copyToClipboard}
        />
        
        <TitleField
          title={title}
          onTitleChange={setTitle}
        />

        <AdultBroadcastField
          isAdult={isAdult}
          onAdultChange={setIsAdult}
        />
        
        <FanBroadcastField
          isFanClub={isFanClub}
          fanLevel={fanLevel}
          onFanClubChange={setIsFanClub}
          onFanLevelChange={setFanLevel}
        />
        
        <PasswordField
          isPrivate={isPrivate}
          password={password}
          onPrivateChange={setIsPrivate}
          onPasswordChange={setPassword}
        />
        
        <SaveButton onSave={handleSaveWithErrorHandling} />
        
        <HelpText />
      </div>
    </div>
  );
}