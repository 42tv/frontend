import api from './auto_refresh_axios';
import { ProductsResponse, PurchaseResponse } from '../_types/product';

/**
 * 활성화된 상품 목록 조회 (사용자용)
 * GET /api/products
 */
export const getActiveProducts = async (): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>('/api/products');
  return response.data;
};

/**
 * 결제 준비 (PG사 데이터 생성)
 * POST /api/payments/prepare
 * @param product_id 구매할 상품 ID
 * @param pg_provider PG사 선택 (기본값: bootpay)
 */
export const preparePayment = async (
  product_id: number,
  pg_provider: 'bootpay' | 'mock' = 'bootpay'
): Promise<PurchaseResponse> => {
  const response = await api.post<PurchaseResponse>('/api/payments/prepare', {
    product_id,
    pg_provider,
  });
  return response.data;
};

/**
 * 상품 구매 (결제 준비)
 * POST /api/payments/purchase
 * @param product_id 구매할 상품 ID
 * @param pg_provider PG사 선택 (선택사항, 기본값: mock)
 */
export const purchaseProduct = async (
  product_id: number,
  pg_provider?: 'mock' | 'toss' | 'inicis' | 'kakaopay'
): Promise<PurchaseResponse> => {
  const response = await api.post<PurchaseResponse>('/api/payments/purchase', {
    product_id,
    ...(pg_provider && { pg_provider }), // pg_provider가 있을 때만 포함
  });
  return response.data;
};
