// Product 관련 타입 정의

import { CoinTopup } from './coin-topup';

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
  /** 유료 충전 건 CoinTopup 레코드 — 보너스 코인은 별도 topup으로 분리되어 여기 포함되지 않음 */
  topup: CoinTopup;
  product: {
    id: number;
    name: string;
    total_coins: number;
  };
  wallet: {
    coin_balance: number;
  };
}

export interface BootpayPGData {
  application_id: string;
  price: number;
  order_name: string;
  order_id: string;
  user: {
    id: string;
    username: string;
    email: string;
    phone: string;
  };
}

export interface RealPGPurchaseData {
  pg_provider: string;
  pg_transaction_id: string;
  redirect_url?: string;
  app_scheme?: string;
  pg_data?: BootpayPGData;
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
