import api from '../auto_refresh_axios';
import { ApiSuccessResponse } from '@/app/_types/api';
import type {
  Inquiry,
  InquiryPagination,
  InquiryStatus,
  InquiryType,
} from '../../_types/inquiry';

export interface AdminInquiriesParams {
  status?: InquiryStatus;
  type?: InquiryType;
  page?: number;
  limit?: number;
}

export interface AdminInquiriesResult {
  inquiries: Inquiry[];
  pagination: InquiryPagination;
}

/**
 * 문의 목록 조회 (status/type 필터 + 페이지네이션)
 * GET /admin/inquiries
 */
export const getAdminInquiries = async (
  params: AdminInquiriesParams,
): Promise<AdminInquiriesResult> => {
  const response = await api.get<
    ApiSuccessResponse<{ inquiries: Inquiry[] }> & {
      pagination?: InquiryPagination;
    }
  >('/api/admin/inquiries', { params });
  return {
    inquiries: response.data.data?.inquiries ?? [],
    pagination:
      response.data.pagination ?? {
        page: 1,
        limit: params.limit ?? 20,
        total: 0,
        totalPages: 1,
      },
  };
};

/**
 * 답변 대기 문의 건수 조회 — 목록 API의 pagination.total 활용 (별도 엔드포인트 불필요)
 */
export const getPendingInquiryCount = async (): Promise<number> => {
  const result = await getAdminInquiries({
    status: 'PENDING',
    page: 1,
    limit: 1,
  });
  return result.pagination.total;
};

/**
 * 문의 상세 조회 (작성자 정보 + 이미지 포함)
 * GET /admin/inquiries/:id
 */
export const getAdminInquiry = async (id: number): Promise<Inquiry> => {
  const response = await api.get<ApiSuccessResponse<Inquiry>>(
    `/api/admin/inquiries/${id}`,
  );
  return response.data.data;
};

/**
 * 답변 등록/수정 — 재답변 시 덮어쓰기, 사용자 미읽음 상태로 재설정
 * POST /admin/inquiries/:id/answer
 */
export const answerInquiry = async (
  id: number,
  answer: string,
): Promise<void> => {
  await api.post(`/api/admin/inquiries/${id}/answer`, { answer });
};
