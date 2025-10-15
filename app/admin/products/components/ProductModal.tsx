import { useState } from 'react';
import { productAPI, Product } from '@/app/_apis/admin';
import ImageUploader from '@/app/admin/components-shared/ImageUploader';
import { ProductFormData } from '../types';

interface ProductModalProps {
  mode: 'create' | 'edit';
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ mode, product, onClose }: ProductModalProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    description: product?.description || '',
    image_url: product?.image_url || '',
    base_coins: product?.base_coins || 0,
    bonus_coins: product?.bonus_coins || 0,
    price: product?.price || 0,
    is_active: product?.is_active ?? true,
    sort_order: product?.sort_order || 0,
    product_type: product?.product_type || 'star',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [shouldRemoveImage, setShouldRemoveImage] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formDataToSend = new FormData();

      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (mode === 'edit' && shouldRemoveImage) {
        formDataToSend.append('remove_image', 'true');
      }

      formDataToSend.append('name', formData.name);
      if (formData.description) {
        formDataToSend.append('description', formData.description);
      }
      formDataToSend.append('base_coins', String(formData.base_coins));
      formDataToSend.append('bonus_coins', '0');
      formDataToSend.append('price', String(formData.price));
      formDataToSend.append('is_active', String(formData.is_active));
      formDataToSend.append('sort_order', String(formData.sort_order));
      formDataToSend.append('product_type', formData.product_type);

      if (mode === 'create') {
        await productAPI.createProduct(formDataToSend);
      } else if (product) {
        await productAPI.updateProduct(product.id, formDataToSend);
      }

      onClose();
    } catch (error) {
      console.error('상품 저장 실패:', error);
      alert('상품 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-background border border-border rounded-lg max-w-3xl w-full p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          {mode === 'create' ? '새 상품 추가' : '상품 수정'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            {/* 왼쪽 컬럼 - 이미지 업로드 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  상품 이미지
                </label>
                <ImageUploader
                  currentImageUrl={formData.image_url}
                  onFileSelect={(file) => {
                    setImageFile(file);
                    setShouldRemoveImage(false);
                  }}
                  onImageRemove={() => {
                    setImageFile(null);
                    setFormData({ ...formData, image_url: '' });
                    setShouldRemoveImage(true);
                  }}
                  maxSizeMB={5}
                  immediateUpload={false}
                />
              </div>
            </div>

            {/* 오른쪽 컬럼 - 상품 정보 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  상품명 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="상품명을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  설명
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="상품 설명을 입력하세요"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  코인 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.base_coins.toLocaleString()}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({ ...formData, base_coins: parseInt(value) || 0 });
                  }}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  가격 (원) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.price.toLocaleString()}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({ ...formData, price: parseInt(value) || 0 });
                  }}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  코인 타입 *
                </label>
                <select
                  value={formData.product_type}
                  onChange={(e) => setFormData({ ...formData, product_type: e.target.value as 'normal' | 'star' })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="normal">일반</option>
                  <option value="star">스타 코인</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    정렬 순서
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    상태
                  </label>
                  <select
                    value={formData.is_active ? 'active' : 'inactive'}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'active' })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="active">활성</option>
                    <option value="inactive">비활성</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              disabled={saving}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? '저장 중...' : mode === 'create' ? '추가' : '수정'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
