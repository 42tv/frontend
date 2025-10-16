import api from "../auto_refresh_axios";

export type ProductType = 'normal' | 'star';

export interface Product {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  base_coins: number;
  bonus_coins: number;
  total_coins: number;
  price: number;
  is_active: boolean;
  sort_order: number;
  product_type: ProductType;
  created_at: string;
  updated_at: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  image_url?: string;
  base_coins: number;
  bonus_coins?: number;
  price: number;
  is_active?: boolean;
  sort_order?: number;
  product_type: ProductType;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: number;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export const productAPI = {
  // 상품 목록 조회 (관리자용 - 모든 상품)
  async getProducts(params?: {
    page?: number;
    limit?: number;
    is_active?: boolean;
  }): Promise<ProductListResponse> {
    const response = await api.get("/api/products/all", { params });
    return response.data;
  },

  // 상품 상세 조회
  async getProduct(id: number): Promise<Product> {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },

  // 상품 생성 - FormData 방식
  async createProduct(formData: FormData): Promise<Product> {
    const response = await api.post("/api/products", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 상품 수정 - FormData 방식 (이미지 포함)
  async updateProduct(id: number, formData: FormData): Promise<Product> {
    const response = await api.patch(`/api/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 상품 삭제
  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/api/products/${id}`);
  },

  // 상품 활성화
  async activateProduct(id: number): Promise<Product> {
    const response = await api.patch(`/api/products/${id}/activate`);
    return response.data;
  },

  // 상품 비활성화
  async deactivateProduct(id: number): Promise<Product> {
    const response = await api.patch(`/api/products/${id}/deactivate`);
    return response.data;
  },

  // 상품 순서 변경
  async updateProductOrder(updates: { id: number; sort_order: number }[]): Promise<void> {
    await api.patch("/api/products/order", { updates });
  },
};