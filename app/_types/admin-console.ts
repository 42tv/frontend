// 관리자 콘솔 UI 타입 정의
// 백엔드 API가 아직 없는 영역(🔧/❌)은 기능 정의서 기준으로 선정의한 타입입니다.
// 백엔드 구현 시 실제 DTO에 맞춰 조정이 필요합니다.

// ===== 회원 관리 (§3) =====

export type OAuthProvider = 'GOOGLE' | 'KAKAO' | 'NAVER' | 'LOCAL';
export type BusinessType = 'INDIVIDUAL' | 'SOLE_PROPRIETOR' | 'CORPORATION';

export interface AdminUserSummary {
  idx: number;
  user_id: string;
  nickname: string;
  profile_img: string | null;
  oauth_provider: OAuthProvider;
  is_admin: boolean;
  is_identity_verified: boolean;
  is_adult_verified: boolean;
  business_type: BusinessType;
  created_at: string;
  status: UserSanctionStatus;
}

export interface AdminUserDetail extends AdminUserSummary {
  // UserDetail (pgcrypto 암호화 저장 — 화면에서는 기본 마스킹)
  name: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  // 코인 잔액
  coin_balance: number;
  total_topup: number;
  total_usage: number;
  total_received: number;
  // 채널/팬
  channel_title: string | null;
  follower_count: number;
  following_count: number;
}

export type UserSanctionStatus = 'ACTIVE' | 'SUSPENDED' | 'BROADCAST_BANNED';

export type SanctionType =
  | 'ACCOUNT_SUSPEND'
  | 'BROADCAST_BAN'
  | 'WARNING';

export type SanctionStatus = 'ACTIVE' | 'EXPIRED' | 'RELEASED';

export interface Sanction {
  id: number;
  user_idx: number;
  user_id: string;
  nickname: string;
  type: SanctionType;
  reason: string;
  admin_nickname: string;
  starts_at: string;
  status: SanctionStatus;
  created_at: string;
}

// ===== 관리자 회원 API (admin/users — 실제 백엔드 응답 형태) =====

export type AdminPrivacyField = 'name' | 'phone' | 'email' | 'address';

export interface ActiveSanctionSummary {
  id: number;
  type: SanctionType;
}

/** GET admin/users 목록 항목 */
export interface AdminUserListItem {
  idx: number;
  user_id: string;
  nickname: string;
  profile_img: string | null;
  oauth_provider: OAuthProvider;
  is_admin: boolean;
  is_identity_verified: boolean;
  identity_verified_at: string | null;
  is_adult_verified: boolean;
  business_type: BusinessType;
  created_at: string;
  coin_balance: number;
  active_sanctions: ActiveSanctionSummary[];
}

export interface AdminUserSearchParams {
  search?: string;
  provider?: OAuthProvider;
  identityVerified?: boolean;
  adultVerified?: boolean;
  isAdmin?: boolean;
  businessType?: BusinessType;
  status?: UserSanctionStatus;
  page?: number;
  limit?: number;
}

export interface AdminUserSanction {
  id: number;
  user_idx: number;
  type: SanctionType;
  status: SanctionStatus;
  reason: string;
  admin_idx: number;
  released_at: string | null;
  release_reason: string | null;
  created_at: string;
  is_active: boolean;
}

/** GET admin/users/:idx 상세 — 개인정보는 마스킹되어 내려온다 */
export interface AdminUserDetailData {
  idx: number;
  user_id: string;
  nickname: string;
  profile_img: string | null;
  oauth_provider: OAuthProvider;
  is_admin: boolean;
  is_identity_verified: boolean;
  identity_verified_at: string | null;
  is_adult_verified: boolean;
  business_type: BusinessType;
  created_at: string;
  userDetail: {
    name: string;
    sex: string | null;
    phone: string;
    email: string;
    address: string;
    created_at: string;
  } | null;
  coinBalance: {
    coin_balance: number;
    total_charged: number;
    total_used: number;
    total_received: number;
  } | null;
  channel: {
    title: string;
    bookmark: number;
    recommend: number;
    watch: number;
    total_time: number;
  } | null;
  ncpChannel: {
    channel_id: string;
    channel_status: string;
  } | null;
  is_live: boolean;
  counts: {
    fans: number;
    following: number;
    bookmarked_by: number;
  };
  sanctions: AdminUserSanction[];
}

// ===== 방송 관리 (§4) =====

export type BroadcastCategory = 'GAME' | 'MUKBANG' | 'TALK_DAILY' | 'ADULT' | 'MUSIC';

export interface AdminLiveStream {
  broadcaster_idx: number;
  broadcaster_id: string;
  broadcaster_nickname: string;
  title: string;
  thumbnail: string;
  category: BroadcastCategory;
  viewer_count: number;
  start_time: string;
  is_adult: boolean;
  is_fan: boolean;
  is_pw: boolean;
}

// ===== 채팅 관리 (§5) =====

export type BannedWordAction = 'MASK' | 'BLOCK';

export interface BannedWord {
  id: number;
  word: string;
  action: BannedWordAction;
  created_by: number | null;
  created_at: string;
}

// ===== 신고 시스템 (§6) =====

export type ReportTargetType = 'BROADCAST' | 'CHAT' | 'PROFILE' | 'POST' | 'ARTICLE';
export type ReportStatus = 'RECEIVED' | 'IN_PROGRESS' | 'RESOLVED' | 'DISMISSED';
export type ReportAction = 'DISMISS' | 'WARN' | 'END_BROADCAST' | 'SUSPEND';

export interface Report {
  id: number;
  target_type: ReportTargetType;
  status: ReportStatus;
  reason: string;
  detail: string;
  reporter_nickname: string;
  reported_user_id: string;
  reported_nickname: string;
  report_count: number; // 동일 대상 누적 신고 수
  evidence: string | null;
  created_at: string;
  resolved_action: ReportAction | null;
}

// ===== 결제/코인 (§7) =====

export type PaymentStatus =
  | 'PENDING'
  | 'WAITING_DEPOSIT'
  | 'SUCCESS'
  | 'FAILED'
  | 'CANCELED'
  | 'EXPIRED';

export type PaymentMethod = 'CARD' | 'VBANK' | 'EASY_PAY';

export interface AdminPaymentTransaction {
  id: number;
  transaction_id: string;
  topup_id: number | null;
  user_id: string;
  nickname: string;
  product_name: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  pg: string;
  receipt_url: string | null;
  created_at: string;
}

export type CoinTopupStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'FROZEN';

export interface AdminCoinLedger {
  user_idx: number;
  user_id: string;
  nickname: string;
  balance: number;
  total_topup: number;
  total_usage: number;
  total_received: number;
  last_activity_at: string;
}

// ===== 후원 (§8) =====

export interface AdminDonation {
  id: number;
  donor_id: string;
  donor_nickname: string;
  streamer_id: string;
  streamer_nickname: string;
  coin_amount: number;
  krw_value: number;
  message: string | null;
  is_suspicious: boolean;
  created_at: string;
}

// ===== 정산 계좌 (§9-3) =====

export type AccountVerifyStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'FAILED' | 'REVOKED';

export interface SettlementAccount {
  id: number;
  streamer_idx: number;
  streamer_nickname: string;
  bank_name: string;
  account_number_masked: string;
  holder_name_masked: string;
  business_type: BusinessType;
  verify_status: AccountVerifyStatus;
  created_at: string;
}

// ===== 약관 (§11-2) =====

export interface AdminTerms {
  id: number;
  version: string;
  title: string;
  effective_at: string;
  agreed_count: number;
  is_active: boolean;
  created_at: string;
}

// ===== 시스템 (§14) =====

export type AuditAction =
  | 'APPROVE'
  | 'REJECT'
  | 'PAY'
  | 'PAY_FAILED'
  | 'REFUND'
  | 'SANCTION'
  | 'COIN_GRANT'
  | 'PRIVACY_VIEW';

export interface AuditLog {
  id: number;
  domain: string; // 정산, 환불, 제재 등
  action: AuditAction;
  admin_nickname: string;
  target: string;
  reason: string | null;
  created_at: string;
}

export type HealthStatus = 'HEALTHY' | 'DEGRADED' | 'DOWN' | 'UNKNOWN';

export interface InfraStatusItem {
  name: string;
  description: string;
  status: HealthStatus;
  detail: string;
}
