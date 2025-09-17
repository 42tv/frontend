// Admin UI 관련 타입 정의 (백엔드 스키마와 일치)

// PolicyPageType enum (백엔드와 동일)
export enum PolicyPageType {
  PRIVACY = 'privacy',
  TERMS = 'terms',
  COMMUNITY = 'community',
  SERVICE = 'service',
}

// VersionIncrementType enum (백엔드와 동일)
export enum VersionIncrementType {
  MAJOR = 'major', // 1.0 증가 (1.5 -> 2.0)
  MINOR = 'minor', // 0.1 증가 (1.5 -> 1.6)
}

// Policy 관련 타입 (백엔드 스키마 기준)
export interface Policy {
  id: number;
  page: PolicyPageType;
  title: string;
  content: string;
  version: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PolicyFormData {
  page: PolicyPageType;
  title: string;
  content: string;
  versionIncrementType: VersionIncrementType;
}

// CreatePolicyDto (백엔드 DTO와 동일)
export interface CreatePolicyDto {
  page: PolicyPageType;
  title: string;
  content: string;
  versionIncrementType: VersionIncrementType;
}

// UpdatePolicyDto 
export interface UpdatePolicyDto {
  title?: string;
  content?: string;
  version?: string;
  is_active?: boolean;
}

// API 응답 타입 (백엔드와 정확히 일치)
export type PolicyResponseDto = Policy;

export interface PolicyListResponseDto {
  success: boolean;
  message: string;
  data?: Policy[];
}

export interface PolicyCreateSuccessResponseDto {
  success: string;
  policy: PolicyResponseDto;
}