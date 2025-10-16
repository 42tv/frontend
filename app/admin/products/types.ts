export type StatusFilter = 'all' | 'active' | 'inactive';
export type ProductType = 'normal' | 'star';

export interface ProductFormData {
  name: string;
  description: string;
  image_url: string;
  base_coins: number;
  bonus_coins: number;
  price: number;
  is_active: boolean;
  sort_order: number;
  product_type: ProductType;
}
