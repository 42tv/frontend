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
  products: Product[];
}
