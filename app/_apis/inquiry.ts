import api from './auto_refresh_axios';
import { ApiSuccessResponse } from '@/app/_types/api';
import type {
  Inquiry,
  InquiryPagination,
  InquiryType,
} from '../_types/inquiry';

export interface CreateInquiryData {
  type: InquiryType;
  title: string;
  content: string;
  images: File[];
}

export interface MyInquiriesResult {
  inquiries: Inquiry[];
  pagination: InquiryPagination;
}

/**
 * 문의 접수 (이미지 최대 5장, multipart/form-data)
 * POST /inquiry
 */
export const createInquiry = async (data: CreateInquiryData): Promise<void> => {
  const form = new FormData();
  form.append('type', data.type);
  form.append('title', data.title);
  form.append('content', data.content);
  data.images.forEach((file) => form.append('images', file));
  await api.post('/api/inquiry', form);
};

/**
 * 내 문의 목록 조회 (페이지네이션)
 * GET /inquiry
 */
export const getMyInquiries = async (
  page = 1,
  limit = 10,
): Promise<MyInquiriesResult> => {
  const response = await api.get<
    ApiSuccessResponse<{ inquiries: Inquiry[] }> & {
      pagination?: InquiryPagination;
    }
  >('/api/inquiry', { params: { page, limit } });
  return {
    inquiries: response.data.data?.inquiries ?? [],
    pagination:
      response.data.pagination ?? { page: 1, limit, total: 0, totalPages: 1 },
  };
};

/**
 * 문의 상세 조회 — 답변이 있으면 백엔드가 이 시점에 읽음 처리한다
 * GET /inquiry/:id
 */
export const getInquiry = async (id: number): Promise<Inquiry> => {
  const response = await api.get<ApiSuccessResponse<Inquiry>>(
    `/api/inquiry/${id}`,
  );
  return response.data.data;
};
