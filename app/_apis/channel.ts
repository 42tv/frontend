import api from "./auto_refresh_axios";

/**
 * 채널 사용자 정보
 */
export interface ChannelUser {
  userIdx: number;
  userId: string;
  nickname: string;
  profileImg: string;
}

/**
 * 게시글 항목
 */
export interface ArticleItem {
  id: number;
  title: string;
  content: string;
  authorIdx: number;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  images?: ArticleImage[];
}

/**
 * 게시글 이미지
 */
export interface ArticleImage {
  id: number;
  articleId: number;
  imageUrl: string;
  createdAt: string;
}

/**
 * 페이지네이션 정보
 */
export interface Pagination {
  total: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  offset: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextOffset: number | null;
  prevOffset: number | null;
}

/**
 * 게시글 응답
 */
export interface ArticleResponse {
  data: ArticleItem[];
  pagination: Pagination;
}

/**
 * 팬 레벨 정보
 */
export interface FanLevelSimple {
  id: number;
  name: string;
  min_donation: number;
  color: string;
}

/**
 * 채널 정보
 */
export interface ChannelInfo {
  title: string;
  bookmark: number;
  recommend: number;
  watch: number;
  month_time: number;
  total_time: number;
}

/**
 * 채널 조회 응답
 */
export interface GetChannelResponse {
  user: ChannelUser;
  channel: ChannelInfo | null;
  articles: ArticleResponse;
  fanLevel: FanLevelSimple[];
}

/**
 * 채널 조회 파라미터
 */
export interface GetChannelParams {
  user_id: string;
}

/**
 * 채널 정보 조회
 * @param params 조회 파라미터
 * @returns 채널 정보
 */
export async function getChannel(params: GetChannelParams): Promise<GetChannelResponse> {
  const response = await api.get("/api/channel", {
    params,
    withCredentials: true,
  });
  return response.data;
}