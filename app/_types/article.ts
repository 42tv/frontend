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

export interface ArticleListResponse {
  articles: Article[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
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
  offset?: number;
  limit?: number;
}

export interface GetArticleByIdParams {
  id: number;
  incrementView?: boolean;
}