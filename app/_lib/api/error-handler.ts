import { ErrorResponse } from "@/app/_types/api";

/**
 * Extract error message from API response
 * @param error - Axios error object
 * @returns Human-readable error message
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getApiErrorMessage(error: any): string {
  if (error.response && error.response.data) {
    const { message } = error.response.data as ErrorResponse;
    return message;
  }
  return "API 에러 메시지 추출 실패";
}