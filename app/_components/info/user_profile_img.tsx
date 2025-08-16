import Image from 'next/image'
import { useState, useRef } from 'react'
import { uploadProfileImage } from '@/app/_apis/user';
import useUserStore from '../utils/store/userStore';
import { openModal } from '../utils/overlay/overlayHelpers';
import DefaultAlertMessage from '../modals/default_alert_compoent';
import { getApiErrorMessage } from '@/app/_apis/interfaces';

export default function UserProfileImg({profilePath, width, height} : {profilePath: string, width: number, height: number}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const { setProfileImg } = useUserStore();

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const data = await uploadProfileImage(file);
            setProfileImg(data.imageUrl);
            console.log(data);
        } catch (e) {
            const message = getApiErrorMessage(e);
            openModal(<DefaultAlertMessage message={message} />, { closeButtonSize: "w-[16px] h-[16px]" });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex w-full h-full justify-center items-center relative">
            <div 
                className="flex items-center justify-center rounded-full overflow-hidden border-contentBg border-[1px]" 
                style={{ width: `${width}px`, height: `${height}px`, backgroundColor: 'white' }}
            >
                <Image
                    src={profilePath || "/icons/anonymouse1.svg"} // 기본값 제공
                    alt="Picture of the author"
                    width={width}
                    height={height}
                />
            </div>
            
            {/* Upload button */}
            <button 
                onClick={handleUploadClick}
                className="absolute bottom-0 right-1/2 translate-x-10 translate-y-1 bg-primary hover:bg-primary-hover text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-colors"
                title="프로필 이미지 변경"
                disabled={uploading}
            >
                {uploading ? (
                    <span className="animate-spin">&#8635;</span>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                )}
            </button>
            
            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
        </div>
    )
}