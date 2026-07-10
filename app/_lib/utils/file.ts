/**
 * URL에서 파일명 추출 (쿼리스트링 제거 + 퍼센트 인코딩 복원).
 * 파싱 실패 시 원본 URL을 그대로 반환한다.
 */
export function getFileNameFromUrl(url: string): string {
  try {
    const pathname = new URL(url, 'http://localhost').pathname;
    const fileName = pathname.split('/').pop() ?? '';
    return decodeURIComponent(fileName) || url;
  } catch {
    return url;
  }
}
