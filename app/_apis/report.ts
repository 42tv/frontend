import api from './auto_refresh_axios';
import { ApiSuccessResponse } from '../_types/api';
import type { ReportTargetType } from '../_types/admin-console';

/**
 * 신고 접수 요청 인터페이스 (백엔드 CreateReportDto와 대응)
 */
export interface CreateReportRequest {
  /** 피신고자 user_idx */
  reportedIdx: number;
  targetType: ReportTargetType;
  /** 대상 참조 (stream_id, 게시글 id 등) */
  targetRef?: string;
  reason: string;
  /** 증거 (채팅 로그, 스냅샷 URL 등) */
  evidence?: Record<string, unknown>;
}

/**
 * 신고 접수 API (회원용)
 * POST /report
 * @param data 신고 정보 (피신고자 idx, 대상 유형, 사유 등)
 * @returns 생성된 신고 id
 */
export const createReport = async (
  data: CreateReportRequest,
): Promise<number> => {
  const response = await api.post<ApiSuccessResponse<{ id: number }>>(
    '/api/report',
    data,
  );
  return response.data.data.id;
};
