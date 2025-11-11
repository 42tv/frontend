// Product 관련 타입 정의

export type ProductType = 'normal' | 'star';

export interface Product {
  id: number;
  name: string;
  description?: string;
  base_coins: number;
  bonus_coins: number;
  price: number;
  is_active: boolean;
  sort_order: number;
  image_url?: string;
  product_type: ProductType;
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  success: true;
  data: Product[];
  message?: string;
}

// 결제/충전 관련 타입
export interface MockPurchaseData {
  topup: {
    id: string;
    user_idx: number;
    transaction_id: string;
    product_id: number;
    base_coins: number;
    bonus_coins: number;
    total_coins: number;
    topup_at: string;
  };
  product: {
    id: number;
    name: string;
    total_coins: number;
  };
  wallet: {
    coin_balance: number;
  };
}

export interface RealPGPurchaseData {
  pg_provider: string;
  pg_transaction_id: string;
  redirect_url?: string;
  app_scheme?: string;
  pg_data?: unknown;
  product: {
    id: number;
    name: string;
    price: number;
    total_coins: number;
  };
}

export type PurchaseData = MockPurchaseData | RealPGPurchaseData;

// Backend service layer response (nested inside controller response)
export interface PurchaseServiceResponse {
  success: true;
  message: string;
  data: PurchaseData;
}

// Backend controller response (wraps service response with ResponseWrapper)
export interface PurchaseResponse {
  success: true;
  data: PurchaseServiceResponse;
  message: string;
}
