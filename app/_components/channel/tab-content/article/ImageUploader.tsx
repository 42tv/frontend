'use client'
import { useRef, useState } from 'react';

interface ImageUploaderProps {
  selectedImages: File[];
  previewImages: string[];
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: (index: number) => void;
  maxImages?: number;
}

export default function ImageUploader({
  selectedImages,
  previewImages,
  onImageSelect,
  onImageRemove,
  maxImages = 5
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [zoomedImageIndex, setZoomedImageIndex] = useState<number | null>(null);

  return (
    <div>
      <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2">
        이미지 ({previewImages.length}/{maxImages})
      </label>
      <div className="border-2 border-dashed border-border-primary dark:border-border-primary-dark rounded-lg p-4">
        <div className="flex gap-2">
          {/* Add Image Button - Left Side */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={previewImages.length >= maxImages}
            className="flex-shrink-0 w-20 h-20 flex flex-col items-center justify-center bg-background-secondary dark:bg-background-secondary-dark rounded-lg hover:bg-background-tertiary dark:hover:bg-background-tertiary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-border-secondary dark:border-border-secondary-dark"
          >
            <svg className="w-6 h-6 text-text-secondary dark:text-text-secondary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs text-text-secondary dark:text-text-secondary-dark mt-1 text-center">
              추가
            </span>
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={onImageSelect}
            className="hidden"
          />
          
          {/* Image Slots - Right Side */}
          <div className="flex gap-2 flex-1">
            {Array.from({ length: maxImages }).map((_, index) => (
              <div key={index} className="relative group w-20 h-20">
                {index < previewImages.length ? (
                  /* Filled Slot with Image */
                  <>
                    <img
                      src={previewImages[index]}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border border-border-secondary dark:border-border-secondary-dark cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setZoomedImageIndex(index)}
                    />
                    <button
                      type="button"
                      onClick={() => onImageRemove(index)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-md"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </>
                ) : (
                  /* Empty Slot */
                  <div className="w-full h-full border border-dashed border-border-secondary dark:border-border-secondary-dark rounded-lg flex items-center justify-center opacity-30">
                    <svg className="w-6 h-6 text-text-secondary dark:text-text-secondary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {zoomedImageIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-[60]">
          <div className="relative">
            <img
              src={previewImages[zoomedImageIndex]}
              alt={`확대된 이미지 ${zoomedImageIndex + 1}`}
              className="max-w-[70vw] max-h-[70vh] object-contain rounded-lg"
            />
            
            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-60 text-white px-3 py-1 rounded text-sm">
              {zoomedImageIndex + 1} / {previewImages.length}
            </div>
          </div>

          {/* Fixed Navigation Buttons */}
          {previewImages.length > 1 && (
            <>
              <button
                onClick={() => setZoomedImageIndex(
                  zoomedImageIndex === 0 ? previewImages.length - 1 : zoomedImageIndex - 1
                )}
                className="fixed left-8 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setZoomedImageIndex(
                  zoomedImageIndex === previewImages.length - 1 ? 0 : zoomedImageIndex + 1
                )}
                className="fixed right-8 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Click outside to close */}
          <div 
            className="absolute inset-0 -z-10" 
            onClick={() => setZoomedImageIndex(null)}
          />
        </div>
      )}
    </div>
  );
}