import api from './auto_refresh_axios';
import { ProductsResponse } from '../_types/product';

/**
 * 활성화된 상품 목록 조회 (사용자용)
 * GET /api/products
 */
export const getActiveProducts = async (): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>('/api/products');
  return response.data;
};

/**
 * 상품 구매 (Mock 결제 + 충전)
 * POST /api/payments/purchase
 */
export const purchaseProduct = async (product_id: number) => {
  const response = await api.post('/api/payments/purchase', {
    product_id,
  });
  return response.data;
};
