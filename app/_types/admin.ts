// Admin UI 관련 타입 정의 (UI 전용)

// Policy 관련 타입 (컴포넌트에서 사용)
export interface Policy {
  id: number;
  type: 'terms' | 'privacy';
  title: string;
  content: string;
  version: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PolicyFormData {
  type: 'terms' | 'privacy';
  title: string;
  content: string;
  version: string;
  is_active: boolean;
}