import api from "./auto_refresh_axios";
import { ApiSuccessResponse } from "@/app/_types/api";
import {
  Article,
  CreateArticleDto,
  EditArticleDto,
  ArticleListResponse,
  ArticleResponse,
  GetArticlesParams,
} from "../_types/article";

/**
 * 게시글 작성
 * @param createArticleDto 게시글 데이터
 * @param images 이미지 파일들 (최대 5개)
 * @returns
 */
export async function createArticle(
  createArticleDto: CreateArticleDto,
  images?: File[]
): Promise<ArticleResponse> {
  const formData = new FormData();
  formData.append('title', createArticleDto.title);
  formData.append('content', createArticleDto.content);

  if (images) {
    images.forEach((image) => {
      formData.append('images', image);
    });
  }

  const response = await api.post<ApiSuccessResponse<Article>>("/api/article", formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // 백엔드 응답 구조: { success: true, data: {...}, message: string }
  return {
    success: response.data.success,
    data: response.data.data,
    message: response.data.message
  };
}

/**
 * 게시글 목록 조회 (새로운 API)
 * @param params 조회 파라미터
 * @returns
 */
export async function getArticles(params: GetArticlesParams): Promise<ArticleListResponse> {
  const queryParams = new URLSearchParams();
  queryParams.append('userId', params.userId.toString());

  if (params.page !== undefined) {
    queryParams.append('page', params.page.toString());
  }
  if (params.offset !== undefined) {
    queryParams.append('offset', params.offset.toString());
  }
  if (params.limit !== undefined) {
    queryParams.append('limit', params.limit.toString());
  }

  const response = await api.get<ApiSuccessResponse<{ articles: Article[], pageMeta: any }>>(
    `/api/article?${queryParams.toString()}`,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  // 백엔드 응답 구조: { success: true, data: { articles: [], pageMeta: {} }, message: string }
  // 프론트엔드 기대 구조: { data: [], pagination: {} }
  return {
    data: response.data.data.articles,
    pagination: response.data.data.pageMeta
  };
}

/**
 * 게시글 수정 (이미지 포함)
 * @param id 게시글 ID
 * @param editArticleDto 수정할 데이터
 * @param newImages 새로 업로드할 이미지 파일들
 * @returns
 */
export async function editArticle(
  id: number,
  editArticleDto: EditArticleDto,
  newImages?: File[]
): Promise<ArticleResponse> {
  const formData = new FormData();

  // 제목과 내용 추가 (선택적)
  if (editArticleDto.title !== undefined) {
    formData.append('title', editArticleDto.title);
  }
  if (editArticleDto.content !== undefined) {
    formData.append('content', editArticleDto.content);
  }

  // 유지할 이미지 ID들 추가
  if (editArticleDto.keepImages && editArticleDto.keepImages.length > 0) {
    formData.append('keepImages', editArticleDto.keepImages.join(','));
  }

  // 새로운 이미지 파일들 추가
  if (newImages && newImages.length > 0) {
    newImages.forEach((image) => {
      formData.append('images', image);
    });
  }

  const response = await api.put<ApiSuccessResponse<Article>>(`/api/article/${id}`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // 백엔드 응답 구조: { success: true, data: Article, message: string }
  return {
    success: response.data.success,
    data: response.data.data,
    message: response.data.message
  };
}

/**
 * 게시글 삭제
 * @param id 게시글 ID
 * @returns
 */
export async function deleteArticle(id: number): Promise<ArticleResponse> {
  const response = await api.delete<ApiSuccessResponse<null>>(`/api/article/${id}`, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // 백엔드 응답 구조: { success: true, data: null, message: string }
  return {
    success: response.data.success,
    data: response.data.data,
    message: response.data.message
  };
}
