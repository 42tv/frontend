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

// 백엔드 응답 래퍼 인터페이스
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const productAPI = {
  // 상품 목록 조회 (관리자용 - 모든 상품)
  async getProducts(params?: {
    page?: number;
    limit?: number;
    is_active?: boolean;
  }): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>("/api/admin/product", { params });
    return response.data.data; // ResponseWrapper의 data 필드에서 상품 배열 추출
  },

  // 상품 상세 조회
  async getProduct(id: number): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`/api/admin/product/${id}`);
    return response.data.data; // ResponseWrapper의 data 필드에서 상품 추출
  },

  // 상품 생성 - FormData 방식
  async createProduct(formData: FormData): Promise<Product> {
    const response = await api.post<ApiResponse<{ product: Product }>>("/api/admin/product", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data.product; // ResponseWrapper의 data.product에서 상품 추출
  },

  // 상품 수정 - FormData 방식 (이미지 포함)
  async updateProduct(id: number, formData: FormData): Promise<Product> {
    const response = await api.patch<ApiResponse<Product>>(`/api/admin/product/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data; // ResponseWrapper의 data 필드에서 상품 추출
  },

  // 상품 삭제
  async deleteProduct(id: number): Promise<void> {
    await api.delete<ApiResponse<null>>(`/api/admin/product/${id}`);
  },

  // 상품 활성화
  async activateProduct(id: number): Promise<Product> {
    const response = await api.patch<ApiResponse<Product>>(`/api/admin/product/${id}/activate`);
    return response.data.data; // ResponseWrapper의 data 필드에서 상품 추출
  },

  // 상품 비활성화
  async deactivateProduct(id: number): Promise<Product> {
    const response = await api.patch<ApiResponse<Product>>(`/api/admin/product/${id}/deactivate`);
    return response.data.data; // ResponseWrapper의 data 필드에서 상품 추출
  },
};
