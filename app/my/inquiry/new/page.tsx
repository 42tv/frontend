'use client'
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import MyLayOut from '@/app/my/info/components/layout';
import { createInquiry } from '@/app/_apis/inquiry';
import type { InquiryType } from '@/app/_types/inquiry';
import { inquiryTypeLabels } from '@/app/_types/inquiry';

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_TITLE_LENGTH = 100;
const MAX_CONTENT_LENGTH = 3000;

interface ImagePreview {
    file: File;
    url: string;
}

export default function InquiryNewPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [type, setType] = useState<InquiryType>('GENERAL');
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [images, setImages] = useState<ImagePreview[]>([]);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSelectImages = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const files = Array.from(event.target.files ?? []);
        event.target.value = '';
        if (files.length === 0) return;

        if (images.length + files.length > MAX_IMAGES) {
            setError(`이미지는 최대 ${MAX_IMAGES}장까지 첨부할 수 있습니다.`);
            return;
        }
        for (const file of files) {
            if (!ALLOWED_TYPES.includes(file.type)) {
                setError('jpg, jpeg, png 형식의 이미지만 첨부할 수 있습니다.');
                return;
            }
            if (file.size > MAX_IMAGE_SIZE) {
                setError('이미지는 장당 5MB 이하여야 합니다.');
                return;
            }
        }

        setError(null);
        setImages((prev) => [
            ...prev,
            ...files.map((file) => ({ file, url: URL.createObjectURL(file) })),
        ]);
    };

    const handleRemoveImage = (index: number): void => {
        setImages((prev) => {
            URL.revokeObjectURL(prev[index].url);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async (): Promise<void> => {
        if (!title.trim()) {
            setError('제목을 입력해주세요.');
            return;
        }
        if (!content.trim()) {
            setError('내용을 입력해주세요.');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);
            await createInquiry({
                type,
                title: title.trim(),
                content: content.trim(),
                images: images.map((img) => img.file),
            });
            images.forEach((img) => URL.revokeObjectURL(img.url));
            router.push('/my/inquiry');
        } catch (err: unknown) {
            console.error('Failed to create inquiry:', err);
            const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            setError(message || '문의 접수에 실패했습니다. 잠시 후 다시 시도해주세요.');
            setSubmitting(false);
        }
    };

    return (
        <MyLayOut>
            <div className="flex flex-col w-full h-full p-6 max-w-3xl mx-auto">
                <h2 className="text-xl font-bold mb-6 text-text-primary">문의하기</h2>

                <div className="flex flex-col gap-5">
                    {/* 문의 유형 */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">문의 유형</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as InquiryType)}
                            className="w-full px-3 py-2.5 text-sm rounded-lg border border-border-primary bg-bg-secondary text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                        >
                            {(Object.entries(inquiryTypeLabels) as [InquiryType, string][]).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>

                    {/* 제목 */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">
                            제목
                            <span className="ml-2 text-xs text-text-secondary font-normal">{title.length}/{MAX_TITLE_LENGTH}</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            maxLength={MAX_TITLE_LENGTH}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="문의 제목을 입력해주세요"
                            className="w-full px-3 py-2.5 text-sm rounded-lg border border-border-primary bg-bg-secondary text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                    </div>

                    {/* 내용 */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">
                            내용
                            <span className="ml-2 text-xs text-text-secondary font-normal">{content.length}/{MAX_CONTENT_LENGTH}</span>
                        </label>
                        <textarea
                            value={content}
                            maxLength={MAX_CONTENT_LENGTH}
                            onChange={(e) => setContent(e.target.value)}
                            rows={8}
                            placeholder="문의 내용을 자세히 입력해주세요"
                            className="w-full px-3 py-2.5 text-sm rounded-lg border border-border-primary bg-bg-secondary text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent resize-y"
                        />
                    </div>

                    {/* 이미지 첨부 */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">
                            이미지 첨부
                            <span className="ml-2 text-xs text-text-secondary font-normal">
                                최대 {MAX_IMAGES}장, 장당 5MB (jpg/png) — {images.length}/{MAX_IMAGES}
                            </span>
                        </label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png"
                            multiple
                            onChange={handleSelectImages}
                            className="hidden"
                        />
                        <div className="flex flex-wrap gap-3">
                            {images.map((img, index) => (
                                <div key={img.url} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border-primary">
                                    <Image src={img.url} alt={`첨부 이미지 ${index + 1}`} fill unoptimized className="object-cover" />
                                    <button
                                        onClick={() => handleRemoveImage(index)}
                                        aria-label="이미지 삭제"
                                        className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded-full bg-black/60 text-white text-xs hover:bg-black/80 transition-colors"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            {images.length < MAX_IMAGES && (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-24 h-24 flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border-primary text-text-secondary hover:bg-bg-tertiary transition-colors"
                                >
                                    <span className="text-2xl leading-none">+</span>
                                    <span className="text-xs">추가</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-error-dark bg-red-50 dark:bg-red-900/20 rounded-lg px-4 py-3">{error}</p>
                    )}

                    {/* 액션 */}
                    <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                            onClick={() => router.push('/my/inquiry')}
                            disabled={submitting}
                            className="px-4 py-2 text-sm rounded-lg border border-border-primary text-text-secondary hover:bg-bg-tertiary disabled:opacity-50 transition-colors"
                        >
                            취소
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting || !title.trim() || !content.trim()}
                            className="px-5 py-2 text-sm font-medium rounded-lg bg-accent text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
                        >
                            {submitting ? '접수 중...' : '접수하기'}
                        </button>
                    </div>
                </div>
            </div>
        </MyLayOut>
    );
}
