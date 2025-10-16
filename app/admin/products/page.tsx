'use client';

import { useState } from 'react';
import { Product } from '@/app/_apis/admin';
import { useProducts } from './hooks/useProducts';
import { useProductFilters } from './hooks/useProductFilters';
import ProductFilters from './components/ProductFilters';
import ProductStatistics from './components/ProductStatistics';
import ProductTable from './components/ProductTable';
import ProductModal from './components/ProductModal';

export default function ProductManagement() {
  const { products, loading, loadProducts, deleteProduct, toggleProductStatus } = useProducts();
  const { searchTerm, setSearchTerm, statusFilter, setStatusFilter, filteredProducts } = useProductFilters(products);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const openModal = (mode: 'create' | 'edit', product?: Product) => {
    setModalMode(mode);
    setSelectedProduct(product || null);
    setIsModalOpen(true);
  };

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
      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* 상품 통계 */}
      <ProductStatistics products={products} />

      {/* 상품 목록 */}
      <ProductTable
        products={filteredProducts}
        onEdit={(product) => openModal('edit', product)}
        onDelete={deleteProduct}
        onToggleStatus={toggleProductStatus}
      />

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
