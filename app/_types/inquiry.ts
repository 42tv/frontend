// 1:1 문의(Inquiry) 관련 타입 정의

export type InquiryType = 'GENERAL' | 'ACCOUNT' | 'PAYMENT' | 'OTHER';
export type InquiryStatus = 'PENDING' | 'ANSWERED';

export interface InquiryImage {
  id: number;
  image_url: string;
  image_order: number;
}

export interface InquiryUser {
  idx: number;
  user_id: string;
  nickname: string;
}

export interface Inquiry {
  id: number;
  user_idx: number;
  type: InquiryType;
  title: string;
  content: string;
  status: InquiryStatus;
  answer: string | null;
  answered_by: number | null;
  answered_at: string | null;
  is_answer_read: boolean;
  created_at: string;
  updated_at: string;
  images: InquiryImage[];
  user?: InquiryUser;
  answerer?: InquiryUser | null;
}

export interface InquiryPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const inquiryTypeLabels: Record<InquiryType, string> = {
  GENERAL: '일반 문의',
  ACCOUNT: '계정 문의',
  PAYMENT: '결제 문의',
  OTHER: '기타',
};

export const inquiryStatusLabels: Record<InquiryStatus, string> = {
  PENDING: '답변 대기',
  ANSWERED: '답변 완료',
};
