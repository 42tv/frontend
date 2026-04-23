import api from './auto_refresh_axios';
import type {
  DonationStatsData,
  DonationRankingItem,
  DonationTrendItem,
  DonationTrendUnit,
} from '../_types/donation';

/**
 * 후원하기 요청 인터페이스
 */
export interface CreateDonationRequest {
  coin_amount: number;
  streamer_user_id: string;
  message?: string;
}

/**
 * 후원 응답 인터페이스
 */
export interface DonationResponse {
  message: string;
  donation: {
    id: string;
    coin_amount: number;
    coin_value: number;
    message: string | null;
    donated_at: string;
    streamer: {
      idx: number;
      nickname: string;
      profile_img: string;
    };
  };
}

/**
 * 후원하기 API
 * @param data 후원 정보 (코인량, 스트리머 ID, 메시지)
 * @returns 생성된 후원 정보
 */
export const createDonation = async (
  data: CreateDonationRequest
): Promise<DonationResponse> => {
  const response = await api.post<{ success: boolean; data: { donation: DonationResponse['donation'] }; message: string }>('/api/donation', data);
  return {
    message: response.data.message || '',
    donation: response.data.data.donation
  };
};

/**
 * 받은 후원 목록 조회 인터페이스
 */
export interface GetDonationsQuery {
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

/**
 * 보낸 후원 목록 응답 인터페이스
 */
export interface SentDonationsResponse {
  donations: Array<{
    id: string;
    coin_amount: number;
    coin_value: number;
    message: string | null;
    donated_at: string;
    streamer: {
      idx: number;
      nickname: string;
      user_id: string;
      profile_img: string;
    };
  }>;
  total: number;
  limit: number;
  offset: number;
}

/**
 * 보낸 후원 목록 조회 API
 * @param query 쿼리 파라미터 (기간, limit, offset)
 * @returns 보낸 후원 목록
 */
export const getSentDonations = async (
  query?: GetDonationsQuery
): Promise<SentDonationsResponse> => {
  const response = await api.get<{ success: boolean; data: SentDonationsResponse }>('/api/donation/sent', {
    params: query,
  });
  return response.data.data;
};

/**
 * 후원 요약 통계 조회 API
 * @param query 쿼리 파라미터 (기간)
 * @returns 총 후원액, 횟수, 평균 등 요약 지표
 */
export const getDonationSummaryStats = async (query?: {
  startDate?: string;
  endDate?: string;
}): Promise<DonationStatsData> => {
  const response = await api.get<{ success: boolean; data: DonationStatsData }>('/api/donation/stats', {
    params: query,
  });
  return response.data.data;
};

/**
 * 후원자 순위 조회 API (상위 10명)
 * @param query 쿼리 파라미터 (기간)
 * @returns 후원자 순위 목록
 */
export const getDonationRanking = async (query?: {
  startDate?: string;
  endDate?: string;
}): Promise<DonationRankingItem[]> => {
  const response = await api.get<{ success: boolean; data: { ranking: DonationRankingItem[] } }>(
    '/api/donation/stats/ranking',
    { params: query },
  );
  return response.data.data.ranking;
};

/**
 * 기간별 후원 추이 조회 API
 * @param query startDate, endDate (필수), unit (선택: day|week|month)
 * @returns 기간별 후원 추이 목록
 */
export const getDonationTrend = async (query: {
  startDate: string;
  endDate: string;
  unit?: DonationTrendUnit;
}): Promise<DonationTrendItem[]> => {
  const response = await api.get<{ success: boolean; data: { trend: DonationTrendItem[] } }>(
    '/api/donation/stats/trend',
    { params: query },
  );
  return response.data.data.trend;
};
