import api from './auto_refresh_axios';

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
 * 받은 후원 목록 응답 인터페이스
 */
export interface ReceivedDonationsResponse {
  donations: Array<{
    id: string;
    coin_amount: number;
    coin_value: number;
    message: string | null;
    donated_at: string;
    donor: {
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
 * 받은 후원 목록 조회 API
 * @param query 쿼리 파라미터 (기간, limit, offset)
 * @returns 받은 후원 목록
 */
export const getReceivedDonations = async (
  query?: GetDonationsQuery
): Promise<ReceivedDonationsResponse> => {
  const response = await api.get<{ success: boolean; data: ReceivedDonationsResponse }>(
    '/api/donation/received',
    { params: query }
  );
  return response.data.data;
};

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
 * 후원 통계 조회 인터페이스
 */
export interface DonationStats {
  total_received: number;
  total_count: number;
  average_donation: number;
}

/**
 * 후원 통계 조회 API
 * @param query 쿼리 파라미터 (기간)
 * @returns 후원 통계
 */
export const getDonationStats = async (query?: {
  startDate?: string;
  endDate?: string;
}): Promise<DonationStats> => {
  const response = await api.get<{ success: boolean; data: DonationStats }>('/api/donation/stats', {
    params: query,
  });
  return response.data.data;
};
