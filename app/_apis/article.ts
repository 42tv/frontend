import api from "./auto_refresh_axios";
import {
  Article,
  CreateArticleDto,
  UpdateArticleDto,
  EditArticleDto,
  ArticleListResponse,
  ArticleResponse,
  ArticleListByAuthorParams,
  GetArticleByIdParams,
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

  const response = await api.post("/api/article", formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

/**
 * 게시글 상세 조회
 * @param params 게시글 조회 파라미터
 * @returns 
 */
export async function getArticleById(params: GetArticleByIdParams): Promise<Article> {
  const queryParams = new URLSearchParams();
  if (params.incrementView) {
    queryParams.append('view', 'true');
  }
  
  const response = await api.get(
    `/api/article/${params.id}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}

/**
 * 게시글 목록 조회 (새로운 API)
 * @param params 조회 파라미터
 * @returns 
 */
export async function getArticles(params: GetArticlesParams): Promise<ArticleListResponse> {
  const queryParams = new URLSearchParams();
  queryParams.append('userIdx', params.userIdx.toString());
  
  if (params.page !== undefined) {
    queryParams.append('page', params.page.toString());
  }
  if (params.offset !== undefined) {
    queryParams.append('offset', params.offset.toString());
  }
  if (params.limit !== undefined) {
    queryParams.append('limit', params.limit.toString());
  }
  
  const response = await api.get(
    `/api/article?${queryParams.toString()}`,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}

/**
 * 작성자별 게시글 목록 조회 (레거시)
 * @param params 조회 파라미터
 * @returns 
 * @deprecated getArticles 함수를 사용하세요
 */
export async function getArticlesByAuthor(params: ArticleListByAuthorParams): Promise<ArticleListResponse> {
  const queryParams = new URLSearchParams();
  if (params.page) {
    queryParams.append('page', params.page.toString());
  }
  if (params.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  
  const response = await api.get(
    `/api/article/author/${params.authorId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
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

  const response = await api.put(`/api/article/${id}`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

/**
 * 게시글 수정 (레거시)
 * @param id 게시글 ID
 * @param updateArticleDto 수정할 데이터
 * @returns 
 * @deprecated editArticle 함수를 사용하세요
 */
export async function updateArticle(
  id: number,
  updateArticleDto: UpdateArticleDto
): Promise<ArticleResponse> {
  const response = await api.put(`/api/article/${id}`, updateArticleDto, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

/**
 * 게시글 삭제
 * @param id 게시글 ID
 * @returns 
 */
export async function deleteArticle(id: number): Promise<ArticleResponse> {
  const response = await api.delete(`/api/article/${id}`, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}