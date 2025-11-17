// API related interfaces

/**
 * 백엔드 표준 성공 응답 (ResponseWrapper.success)
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

/**
 * 백엔드 표준 에러 응답
 */
export interface ErrorResponse {
  message: string;
  code: string;
}


