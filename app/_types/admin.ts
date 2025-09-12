// Admin UI 관련 타입 정의 (백엔드 스키마와 일치)

// Policy 관련 타입 (백엔드 스키마 기준)
export interface Policy {
  id: number;
  page: string; // 'privacy', 'terms' 등
  title: string;
  content: string;
  version: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PolicyFormData {
  page: string; // 'privacy', 'terms' 등
  title: string;
  content: string;
  version: string;
  is_active: boolean;
}