'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploaderProps {
  currentImageUrl?: string;
  onImageChange?: (imageUrl: string) => void;
  onImageRemove: () => void;
  onFileSelect?: (file: File) => void;
  uploadFunction?: (file: File) => Promise<{ imageUrl: string }>;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  immediateUpload?: boolean;
}

export default function ImageUploader({
  currentImageUrl,
  onImageChange,
  onImageRemove,
  onFileSelect,
  uploadFunction,
  maxSizeMB = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  immediateUpload = true
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 프리뷰 크기 설정 (향후 사용을 위해 보관)
  // const previewSizes = {
  //   small: 'w-16 h-16',
  //   medium: 'w-24 h-24',
  //   large: 'w-32 h-32'
  // };
  // const previewClass = previewSizes[previewSize];

  // 파일 유효성 검사
  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return '지원되지 않는 파일 형식입니다. (JPEG, PNG, GIF, WebP만 지원)';
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      return `파일 크기가 ${maxSizeMB}MB를 초과합니다.`;
    }

    return null;
  };

  // 파일 업로드 처리
  const handleFileUpload = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }

    if (immediateUpload && uploadFunction && onImageChange) {
      // 즉시 업로드 모드
      setIsUploading(true);
      try {
        const result = await uploadFunction(file);
        onImageChange(result.imageUrl);
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        alert('이미지 업로드에 실패했습니다.');
      } finally {
        setIsUploading(false);
      }
    } else if (onFileSelect) {
      // 지연 업로드 모드 - 파일만 선택하고 미리보기 표시
      onFileSelect(file);

      // 미리보기 URL 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 파일 선택 처리
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // 드래그 앤 드롭 처리
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // 파일 선택 버튼 클릭
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // 이미지 삭제 처리
  const handleRemove = () => {
    setPreviewUrl(null);
    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageRemove();
  };

  // 표시할 이미지 URL (미리보기 우선, 없으면 현재 이미지)
  const displayImageUrl = previewUrl || currentImageUrl;

  return (
    <div className="space-y-4">
      {/* 파일 업로드 영역 */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
        } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground">이미지 업로드 중...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="mx-auto w-12 h-12 text-muted-foreground">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                이미지를 드래그하거나 클릭하여 업로드하세요
              </p>
              <button
                type="button"
                onClick={handleButtonClick}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                파일 선택
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              JPEG, PNG, GIF, WebP 형식, 최대 {maxSizeMB}MB
            </p>
          </div>
        )}
      </div>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* 현재 이미지 또는 미리보기 표시 */}
      {displayImageUrl && (
        <div className="w-full rounded-lg bg-muted p-4 flex items-center justify-center relative group">
          <div className="relative max-w-full max-h-80 flex items-center justify-center">
            {previewUrl ? (
              // 미리보기 이미지 (로컬 파일)
              <img
                src={previewUrl}
                alt="미리보기"
                className="max-w-full max-h-80 object-contain rounded"
              />
            ) : (
              // 기존 이미지 (URL)
              <Image
                src={currentImageUrl!}
                alt="현재 이미지"
                width={400}
                height={320}
                className="max-w-full max-h-80 object-contain rounded"
              />
            )}
          </div>
          {/* 삭제 버튼 */}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            title="이미지 삭제"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}