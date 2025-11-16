import { useState, useEffect } from 'react';
import { productAPI, Product } from '@/app/_apis/admin';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const products = await productAPI.getProducts();
      setProducts(products || []);
    } catch (error) {
      console.error('상품 목록 로드 실패:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const deleteProduct = async (id: number) => {
    if (!confirm('정말로 이 상품을 삭제하시겠습니까?')) return;

    try {
      await productAPI.deleteProduct(id);
      loadProducts();
    } catch (error) {
      console.error('상품 삭제 실패:', error);
      alert('상품 삭제에 실패했습니다.');
    }
  };

  const toggleProductStatus = async (id: number, currentStatus: boolean) => {
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

  return {
    products,
    loading,
    loadProducts,
    deleteProduct,
    toggleProductStatus,
  };
}
