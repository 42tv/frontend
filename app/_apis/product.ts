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
