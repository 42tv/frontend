'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { productAPI, Product } from "@/app/_apis/admin";
import ImageUploader from "@/app/_components/admin/ImageUploader";

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // 상품 목록 로드
  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProducts();
      setProducts(response.products || []);
    } catch (error) {
      console.error('상품 목록 로드 실패:', error);
      setProducts([]); // 에러 시 빈 배열로 설정
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // 필터링된 상품 목록
  const filteredProducts = (products || []).filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'active' && product.is_active) ||
                         (statusFilter === 'inactive' && !product.is_active);

    return matchesSearch && matchesStatus;
  });

  // 상품 생성/수정 모달 열기
  const openModal = (mode: 'create' | 'edit', product?: Product) => {
    setModalMode(mode);
    setSelectedProduct(product || null);
    setIsModalOpen(true);
  };

  // 상품 삭제
  const handleDelete = async (id: number) => {
    if (!confirm('정말로 이 상품을 삭제하시겠습니까?')) return;

    try {
      await productAPI.deleteProduct(id);
      loadProducts();
    } catch (error) {
      console.error('상품 삭제 실패:', error);
      alert('상품 삭제에 실패했습니다.');
    }
  };

  // 상품 활성화/비활성화
  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await productAPI.deactivateProduct(id);
      } else {
        await productAPI.activateProduct(id);
      }
      loadProducts();
    } catch (error) {
      console.error('상품 상태 변경 실패:', error);
      alert('상품 상태 변경에 실패했습니다.');
    }
  };

  // 모달 닫기 및 새로고침
  const handleModalClose = () => {
    setIsModalOpen(false);
    loadProducts();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">상품 목록 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">상품 관리</h1>
          <p className="text-muted-foreground">코인 상품을 관리하고 가격을 설정하세요</p>
        </div>
        <button
          onClick={() => openModal('create')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          새 상품 추가
        </button>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="상품명 또는 설명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">전체 상태</option>
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
            </select>
          </div>
        </div>
      </div>

      {/* 상품 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">총 상품 수</h3>
            <p className="text-3xl font-bold text-foreground">{(products || []).length}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">활성 상품</h3>
            <p className="text-3xl font-bold text-green-600">{(products || []).filter(p => p.is_active).length}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">비활성 상품</h3>
            <p className="text-3xl font-bold text-red-600">{(products || []).filter(p => !p.is_active).length}</p>
          </div>
        </div>
      </div>

      {/* 상품 목록 */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  상품 정보
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  기본 코인
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  보너스 코인
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  총 코인
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  가격
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-muted-foreground text-xs text-center">
                            이미지<br />없음
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-foreground">{product.name}</div>
                        {product.description && (
                          <div className="text-sm text-muted-foreground">{product.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {product.base_coins.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {product.bonus_coins.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {product.total_coins.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {product.price.toLocaleString()}원
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.is_active
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {product.is_active ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal('edit', product)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleToggleStatus(product.id, product.is_active)}
                        className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 text-sm font-medium"
                      >
                        {product.is_active ? '비활성화' : '활성화'}
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">검색 조건에 맞는 상품이 없습니다.</p>
          </div>
        )}
      </div>

      {/* 상품 추가/수정 모달 */}
      {isModalOpen && (
        <ProductModal
          mode={modalMode}
          product={selectedProduct}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

// 상품 추가/수정 모달 컴포넌트
interface ProductModalProps {
  mode: 'create' | 'edit';
  product: Product | null;
  onClose: () => void;
}

function ProductModal({ mode, product, onClose }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    image_url: product?.image_url || '',
    base_coins: product?.base_coins || 0,
    bonus_coins: product?.bonus_coins || 0,
    price: product?.price || 0,
    is_active: product?.is_active ?? true,
    sort_order: product?.sort_order || 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [shouldRemoveImage, setShouldRemoveImage] = useState(false);
  const [saving, setSaving] = useState(false);

  // 총 코인 자동 계산
  const totalCoins = formData.base_coins + formData.bonus_coins;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // FormData 생성
      const formDataToSend = new FormData();

      // 이미지 파일 추가 (있는 경우)
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      // 이미지 삭제 플래그 추가 (수정 모드이고 이미지 삭제를 원하는 경우)
      if (mode === 'edit' && shouldRemoveImage) {
        formDataToSend.append('remove_image', 'true');
      }

      // 상품 정보 추가 (숫자는 문자열로, boolean도 문자열로)
      formDataToSend.append('name', formData.name);
      if (formData.description) {
        formDataToSend.append('description', formData.description);
      }
      formDataToSend.append('base_coins', String(formData.base_coins));
      formDataToSend.append('bonus_coins', String(formData.bonus_coins));
      formDataToSend.append('price', String(formData.price));
      formDataToSend.append('is_active', String(formData.is_active));
      formDataToSend.append('sort_order', String(formData.sort_order));

      if (mode === 'create') {
        // 단일 요청으로 상품 생성
        await productAPI.createProduct(formDataToSend);
      } else if (product) {
        // 단일 요청으로 상품 수정 (이미지 포함)
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    기본 코인 *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.base_coins}
                    onChange={(e) => setFormData({ ...formData, base_coins: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    보너스 코인
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.bonus_coins}
                    onChange={(e) => setFormData({ ...formData, bonus_coins: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  총 코인 (자동 계산)
                </label>
                <input
                  type="text"
                  disabled
                  value={totalCoins.toLocaleString()}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-muted-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  가격 (원) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
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