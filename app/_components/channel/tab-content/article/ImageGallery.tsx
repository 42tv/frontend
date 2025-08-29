'use client'
import { useState } from 'react';
import { ArticleImage } from '../../../../_types/article';

interface ImageGalleryProps {
  images: ArticleImage[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  if (!images || images.length === 0) {
    return null;
  }

  if (images.length === 1) {
    return (
      <div className="relative">
        <img
          src={images[0].imageUrl}
          alt="게시글 이미지"
          className="w-full aspect-square object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setCurrentImageIndex(0)}
        />
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Main Image Display */}
      <div className="relative">
        <img
          src={images[currentImageIndex].imageUrl}
          alt={`게시글 이미지 ${currentImageIndex + 1}`}
          className="w-full aspect-square object-cover rounded-lg"
        />
        
        {/* Navigation Buttons - Only show on hover */}
        <button
          onClick={() => setCurrentImageIndex(
            currentImageIndex === 0 
              ? images.length - 1 
              : currentImageIndex - 1
          )}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all opacity-0 group-hover:opacity-100"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setCurrentImageIndex(
            currentImageIndex === images.length - 1 
              ? 0 
              : currentImageIndex + 1
          )}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all opacity-0 group-hover:opacity-100"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Image Counter - Only show on hover */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs transition-all opacity-0 group-hover:opacity-100">
          {currentImageIndex + 1} / {images.length}
        </div>
      </div>
      
      {/* Stacked Cards Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-background dark:bg-background-dark rounded-lg transform translate-x-1 translate-y-1 -z-10 opacity-60"></div>
        {images.length > 2 && (
          <div className="absolute inset-0 bg-background dark:bg-background-dark rounded-lg transform translate-x-2 translate-y-2 -z-20 opacity-30"></div>
        )}
      </div>
      
      {/* Thumbnail Navigation */}
      <div className="mt-3 flex gap-1 overflow-x-auto">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setCurrentImageIndex(index)}
            className={`flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden transition-all ${
              index === currentImageIndex 
                ? 'border-primary dark:border-primary-dark' 
                : 'border-border-primary dark:border-border-primary-dark opacity-60 hover:opacity-80'
            }`}
          >
            <img
              src={image.imageUrl}
              alt={`썸네일 ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}