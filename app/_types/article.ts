import { User } from './user';

export interface Article {
  id: number;
  title: string;
  content: string;
  authorIdx: number;
  author?: User;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  images?: ArticleImage[];
}

export interface ArticleImage {
  id: number;
  articleId: number;
  imageUrl: string;
  createdAt: string;
}

export interface CreateArticleDto {
  title: string;
  content: string;
}

export interface UpdateArticleDto {
  title?: string;
  content?: string;
}

export interface EditArticleDto {
  title?: string;
  content?: string;
  keepImages?: number[]; // 유지할 이미지 ID들
}

export interface ArticleListResponse {
  data: Article[];
  pagination: {
    total: number;
    currentPage: number;
    totalPages: number;
    limit: number;
    offset: number;
    hasNext: boolean;
    hasPrev: boolean;
    nextOffset: number | null;
    prevOffset: number | null;
  };
}

export interface ArticleResponse {
  success: boolean;
  data?: Article;
  message?: string;
}

export interface ArticleListByAuthorParams {
  authorId: number;
  page?: number;
  limit?: number;
}

export interface GetArticlesParams {
  userIdx: number;
  page?: number;
  offset?: number;
  limit?: number;
}

export interface GetArticleByIdParams {
  id: number;
  incrementView?: boolean;
}