// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getApiErrorMessage(error: any): string {
  if (error.response && error.response.data) {
    const { message } = error.response.data as ErrorResponse;
    return message;
  }
  return "getApiErrorMessage 변환 실패";
}

export interface ErrorResponse {
  message: string;
  code: string;
}
