// 관리자 콘솔 개발용 더미 데이터
// 백엔드 관리자 API(🔧/❌)가 준비되면 각 페이지에서 실제 API 호출로 교체합니다.
import type {
  AdminUserSummary,
  AdminUserDetail,
  Sanction,
  AdminLiveStream,
  Report,
  AdminPaymentTransaction,
  AdminCoinLedger,
  AdminDonation,
  SettlementAccount,
  AdminTerms,
  AuditLog,
  InfraStatusItem,
} from '@/app/_types/admin-console';

const daysAgo = (days: number, hours: number = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hours);
  return d.toISOString();
};

// ===== 회원 =====

export const dummyUsers: AdminUserSummary[] = [
  { idx: 101, user_id: 'streamer_kim', nickname: '김방송', profile_img: null, oauth_provider: 'KAKAO', is_admin: false, is_identity_verified: true, is_adult_verified: true, business_type: 'SOLE_PROPRIETOR', created_at: daysAgo(320), status: 'ACTIVE' },
  { idx: 102, user_id: 'game_master', nickname: '겜잘알', profile_img: null, oauth_provider: 'GOOGLE', is_admin: false, is_identity_verified: true, is_adult_verified: false, business_type: 'INDIVIDUAL', created_at: daysAgo(210), status: 'ACTIVE' },
  { idx: 103, user_id: 'mukbang_queen', nickname: '먹방여왕', profile_img: null, oauth_provider: 'NAVER', is_admin: false, is_identity_verified: true, is_adult_verified: true, business_type: 'CORPORATION', created_at: daysAgo(180), status: 'ACTIVE' },
  { idx: 104, user_id: 'troll_user01', nickname: '악성유저', profile_img: null, oauth_provider: 'LOCAL', is_admin: false, is_identity_verified: false, is_adult_verified: false, business_type: 'INDIVIDUAL', created_at: daysAgo(95), status: 'SUSPENDED' },
  { idx: 105, user_id: 'chat_spammer', nickname: '도배꾼', profile_img: null, oauth_provider: 'KAKAO', is_admin: false, is_identity_verified: true, is_adult_verified: false, business_type: 'INDIVIDUAL', created_at: daysAgo(60), status: 'ACTIVE' },
  { idx: 106, user_id: 'admin_eno', nickname: '에노', profile_img: null, oauth_provider: 'LOCAL', is_admin: true, is_identity_verified: true, is_adult_verified: true, business_type: 'INDIVIDUAL', created_at: daysAgo(400), status: 'ACTIVE' },
  { idx: 107, user_id: 'music_lover', nickname: '노래하는밤', profile_img: null, oauth_provider: 'GOOGLE', is_admin: false, is_identity_verified: false, is_adult_verified: false, business_type: 'INDIVIDUAL', created_at: daysAgo(14), status: 'ACTIVE' },
  { idx: 108, user_id: 'adult_bj99', nickname: '심야방송', profile_img: null, oauth_provider: 'NAVER', is_admin: false, is_identity_verified: true, is_adult_verified: true, business_type: 'INDIVIDUAL', created_at: daysAgo(45), status: 'BROADCAST_BANNED' },
];

export const dummyUserDetails: Record<number, AdminUserDetail> = Object.fromEntries(
  dummyUsers.map((u) => [
    u.idx,
    {
      ...u,
      name: '홍길동',
      gender: 'M',
      phone: '010-1234-5678',
      email: `${u.user_id}@example.com`,
      address: '서울특별시 강남구 테헤란로 123',
      coin_balance: 15200,
      total_topup: 50000,
      total_usage: 34800,
      total_received: 128000,
      channel_title: `${u.nickname}의 채널`,
      follower_count: 342,
      following_count: 28,
    },
  ]),
);

export const dummySanctions: Sanction[] = [
  { id: 1, user_idx: 104, user_id: 'troll_user01', nickname: '악성유저', type: 'ACCOUNT_SUSPEND', reason: '반복적인 욕설 및 혐오 발언', admin_nickname: '에노', starts_at: daysAgo(5), status: 'ACTIVE', created_at: daysAgo(5) },
  { id: 2, user_idx: 105, user_id: 'chat_spammer', nickname: '도배꾼', type: 'WARNING', reason: '채팅 도배', admin_nickname: '에노', starts_at: daysAgo(3), status: 'ACTIVE', created_at: daysAgo(3) },
  { id: 3, user_idx: 108, user_id: 'adult_bj99', nickname: '심야방송', type: 'BROADCAST_BAN', reason: '성인 콘텐츠를 일반 카테고리로 송출', admin_nickname: '에노', starts_at: daysAgo(10), status: 'ACTIVE', created_at: daysAgo(10) },
  { id: 4, user_idx: 102, user_id: 'game_master', nickname: '겜잘알', type: 'WARNING', reason: '저작권 음원 사용 경고', admin_nickname: '에노', starts_at: daysAgo(40), status: 'RELEASED', created_at: daysAgo(40) },
];

// ===== 방송 =====

export const dummyLiveStreams: AdminLiveStream[] = [
  { broadcaster_idx: 101, broadcaster_id: 'streamer_kim', broadcaster_nickname: '김방송', title: '주말 저녁 토크 방송', thumbnail: '', category: 'TALK_DAILY', viewer_count: 1243, start_time: daysAgo(0, 3), is_adult: false, is_fan: false, is_pw: false },
  { broadcaster_idx: 102, broadcaster_id: 'game_master', broadcaster_nickname: '겜잘알', title: '랭크 1위 도전 (시즌 막바지)', thumbnail: '', category: 'GAME', viewer_count: 867, start_time: daysAgo(0, 5), is_adult: false, is_fan: false, is_pw: false },
  { broadcaster_idx: 103, broadcaster_id: 'mukbang_queen', broadcaster_nickname: '먹방여왕', title: '대왕 문어 먹방 🐙', thumbnail: '', category: 'MUKBANG', viewer_count: 2105, start_time: daysAgo(0, 1), is_adult: false, is_fan: true, is_pw: false },
  { broadcaster_idx: 107, broadcaster_id: 'music_lover', broadcaster_nickname: '노래하는밤', title: '새벽 감성 라이브 (비공개)', thumbnail: '', category: 'MUSIC', viewer_count: 45, start_time: daysAgo(0, 2), is_adult: false, is_fan: false, is_pw: true },
  { broadcaster_idx: 108, broadcaster_id: 'adult_bj99', broadcaster_nickname: '심야방송', title: '심야 성인 방송', thumbnail: '', category: 'ADULT', viewer_count: 312, start_time: daysAgo(0, 4), is_adult: true, is_fan: false, is_pw: false },
];

// ===== 신고 =====

export const dummyReports: Report[] = [
  { id: 1, target_type: 'BROADCAST', status: 'RECEIVED', reason: '성인 콘텐츠 일반 카테고리 송출', detail: '19시경부터 일반 카테고리에서 성인 콘텐츠 방송 중', reporter_nickname: '시청자A', reported_user_id: 'adult_bj99', reported_nickname: '심야방송', report_count: 12, evidence: '스냅샷 3장', created_at: daysAgo(0, 2), resolved_action: null },
  { id: 2, target_type: 'CHAT', status: 'RECEIVED', reason: '욕설/혐오 발언', detail: '채팅에서 반복적인 욕설', reporter_nickname: '시청자B', reported_user_id: 'troll_user01', reported_nickname: '악성유저', report_count: 8, evidence: '채팅 로그', created_at: daysAgo(0, 6), resolved_action: null },
  { id: 3, target_type: 'PROFILE', status: 'IN_PROGRESS', reason: '부적절한 닉네임', detail: '닉네임에 비속어 포함', reporter_nickname: '시청자C', reported_user_id: 'chat_spammer', reported_nickname: '도배꾼', report_count: 3, evidence: null, created_at: daysAgo(1), resolved_action: null },
  { id: 4, target_type: 'POST', status: 'RESOLVED', reason: '스팸 쪽지', detail: '홍보성 쪽지 대량 발송', reporter_nickname: '시청자D', reported_user_id: 'chat_spammer', reported_nickname: '도배꾼', report_count: 15, evidence: '쪽지 내용', created_at: daysAgo(4), resolved_action: 'WARN' },
  { id: 5, target_type: 'CHAT', status: 'DISMISSED', reason: '단순 비방 신고', detail: '게임 실력 지적 (제재 사유 아님)', reporter_nickname: '시청자E', reported_user_id: 'game_master', reported_nickname: '겜잘알', report_count: 1, evidence: null, created_at: daysAgo(6), resolved_action: 'DISMISS' },
];

// ===== 결제/코인 =====

export const dummyPayments: AdminPaymentTransaction[] = [
  { id: 1, transaction_id: 'tx_20260703_0001', topup_id: 501, user_id: 'streamer_kim', nickname: '김방송', product_name: '코인 10,000', amount: 11000, method: 'CARD', status: 'SUCCESS', pg: 'Bootpay', receipt_url: 'https://receipt.bootpay.co.kr/example1', created_at: daysAgo(0, 4) },
  { id: 2, transaction_id: 'tx_20260703_0002', topup_id: 502, user_id: 'mukbang_queen', nickname: '먹방여왕', product_name: '코인 50,000 (보너스 5%)', amount: 55000, method: 'EASY_PAY', status: 'SUCCESS', pg: 'Bootpay', receipt_url: 'https://receipt.bootpay.co.kr/example2', created_at: daysAgo(0, 9) },
  { id: 3, transaction_id: 'tx_20260702_0018', topup_id: null, user_id: 'game_master', nickname: '겜잘알', product_name: '코인 30,000', amount: 33000, method: 'VBANK', status: 'WAITING_DEPOSIT', pg: 'Bootpay', receipt_url: null, created_at: daysAgo(1, 2) },
  { id: 4, transaction_id: 'tx_20260701_0042', topup_id: 498, user_id: 'music_lover', nickname: '노래하는밤', product_name: '코인 5,000', amount: 5500, method: 'CARD', status: 'CANCELED', pg: 'Bootpay', receipt_url: 'https://receipt.bootpay.co.kr/example4', created_at: daysAgo(2, 5) },
  { id: 5, transaction_id: 'tx_20260630_0007', topup_id: null, user_id: 'troll_user01', nickname: '악성유저', product_name: '코인 10,000', amount: 11000, method: 'CARD', status: 'FAILED', pg: 'Bootpay', receipt_url: null, created_at: daysAgo(3, 1) },
];

export const dummyCoinLedgers: AdminCoinLedger[] = [
  { user_idx: 101, user_id: 'streamer_kim', nickname: '김방송', balance: 15200, total_topup: 50000, total_usage: 34800, total_received: 128000, last_activity_at: daysAgo(0, 4) },
  { user_idx: 103, user_id: 'mukbang_queen', nickname: '먹방여왕', balance: 82000, total_topup: 150000, total_usage: 68000, total_received: 340000, last_activity_at: daysAgo(0, 9) },
  { user_idx: 102, user_id: 'game_master', nickname: '겜잘알', balance: 4300, total_topup: 30000, total_usage: 25700, total_received: 89000, last_activity_at: daysAgo(1, 2) },
  { user_idx: 107, user_id: 'music_lover', nickname: '노래하는밤', balance: 500, total_topup: 5000, total_usage: 4500, total_received: 12000, last_activity_at: daysAgo(2, 5) },
];

// ===== 후원 =====

export const dummyDonations: AdminDonation[] = [
  { id: 1, donor_id: 'mukbang_queen', donor_nickname: '먹방여왕', streamer_id: 'streamer_kim', streamer_nickname: '김방송', coin_amount: 10000, krw_value: 10000, message: '오늘 방송 최고예요!', is_suspicious: false, created_at: daysAgo(0, 3) },
  { id: 2, donor_id: 'game_master', donor_nickname: '겜잘알', streamer_id: 'mukbang_queen', streamer_nickname: '먹방여왕', coin_amount: 5000, krw_value: 5000, message: '문어 먹방 응원합니다', is_suspicious: false, created_at: daysAgo(0, 5) },
  { id: 3, donor_id: 'troll_user01', donor_nickname: '악성유저', streamer_id: 'adult_bj99', streamer_nickname: '심야방송', coin_amount: 50000, krw_value: 50000, message: null, is_suspicious: true, created_at: daysAgo(1, 1) },
  { id: 4, donor_id: 'troll_user01', donor_nickname: '악성유저', streamer_id: 'adult_bj99', streamer_nickname: '심야방송', coin_amount: 50000, krw_value: 50000, message: null, is_suspicious: true, created_at: daysAgo(1, 2) },
  { id: 5, donor_id: 'music_lover', donor_nickname: '노래하는밤', streamer_id: 'streamer_kim', streamer_nickname: '김방송', coin_amount: 1000, krw_value: 1000, message: '소소하지만 응원해요', is_suspicious: false, created_at: daysAgo(2, 7) },
];

// ===== 정산 계좌 =====

export const dummySettlementAccounts: SettlementAccount[] = [
  { id: 1, streamer_idx: 101, streamer_nickname: '김방송', bank_name: '국민은행', account_number_masked: '123456-**-***789', holder_name_masked: '김*송', business_type: 'SOLE_PROPRIETOR', verify_status: 'VERIFIED', created_at: daysAgo(300) },
  { id: 2, streamer_idx: 103, streamer_nickname: '먹방여왕', bank_name: '신한은행', account_number_masked: '110-***-**5678', holder_name_masked: '이*정', business_type: 'CORPORATION', verify_status: 'VERIFIED', created_at: daysAgo(150) },
  { id: 3, streamer_idx: 102, streamer_nickname: '겜잘알', bank_name: '카카오뱅크', account_number_masked: '3333-**-***012', holder_name_masked: '박*수', business_type: 'INDIVIDUAL', verify_status: 'PENDING', created_at: daysAgo(3) },
  { id: 4, streamer_idx: 108, streamer_nickname: '심야방송', bank_name: '우리은행', account_number_masked: '1002-***-**3456', holder_name_masked: '최*라', business_type: 'INDIVIDUAL', verify_status: 'FAILED', created_at: daysAgo(20) },
];

// ===== 약관 =====

export const dummyTerms: AdminTerms[] = [
  { id: 1, version: '2.1', title: '서비스 이용약관', effective_at: daysAgo(30), agreed_count: 1180, is_active: true, created_at: daysAgo(45) },
  { id: 2, version: '2.0', title: '서비스 이용약관', effective_at: daysAgo(120), agreed_count: 980, is_active: false, created_at: daysAgo(130) },
  { id: 3, version: '1.0', title: '서비스 이용약관', effective_at: daysAgo(400), agreed_count: 450, is_active: false, created_at: daysAgo(410) },
];

// ===== 감사 로그 =====

export const dummyAuditLogs: AuditLog[] = [
  { id: 1, domain: '정산', action: 'APPROVE', admin_nickname: '에노', target: '정산 #128 (김방송, 1,240,000원)', reason: null, created_at: daysAgo(0, 2) },
  { id: 2, domain: '정산', action: 'REJECT', admin_nickname: '에노', target: '정산 #127 (심야방송, 890,000원)', reason: '계좌 검증 실패', created_at: daysAgo(0, 8) },
  { id: 3, domain: '환불', action: 'REFUND', admin_nickname: '에노', target: '충전 #498 (노래하는밤, 5,500원)', reason: '유저 요청 (미사용 잔액)', created_at: daysAgo(2) },
  { id: 4, domain: '제재', action: 'SANCTION', admin_nickname: '에노', target: 'troll_user01 계정 정지 (영구)', reason: '반복적인 욕설 및 혐오 발언', created_at: daysAgo(5) },
  { id: 5, domain: '코인', action: 'COIN_GRANT', admin_nickname: '에노', target: 'game_master +3,000 코인', reason: '이벤트 보상 (7월 출석왕)', created_at: daysAgo(6) },
  { id: 6, domain: '개인정보', action: 'PRIVACY_VIEW', admin_nickname: '에노', target: 'streamer_kim 연락처 열람', reason: 'CS 문의 대응 (티켓 #442)', created_at: daysAgo(7) },
];

// ===== 인프라 상태 =====

export const dummyInfraStatus: InfraStatusItem[] = [
  { name: 'Redis', description: '채팅 Pub/Sub · 캐시', status: 'HEALTHY', detail: '연결 정상 · 지연 2ms' },
  { name: 'NCP Live Station', description: '라이브 스트리밍', status: 'HEALTHY', detail: '공유 엣지 리전 정상' },
  { name: 'PostgreSQL', description: '메인 데이터베이스', status: 'HEALTHY', detail: '연결 풀 12/100' },
  { name: 'Bootpay PG', description: '결제 게이트웨이', status: 'HEALTHY', detail: '웹훅 수신 정상' },
  { name: '본인인증 연동', description: 'Identity Verification', status: 'UNKNOWN', detail: '헬스체크 API 미연동' },
  { name: 'Graylog', description: '로그 수집', status: 'HEALTHY', detail: '대시보드 링크로 이동' },
];

// ===== 대시보드 통계 =====

export interface DashboardStats {
  liveCount: number;
  totalViewers: number;
  todaySales: number;
  weekSales: number;
  monthSales: number;
  todayRefund: number;
  todayDonationCoins: number;
  weekDonationCoins: number;
  todaySignups: number;
  todayWithdrawals: number;
  pendingReports: number;
}

export const dummyDashboardStats: DashboardStats = {
  liveCount: 5,
  totalViewers: 4572,
  todaySales: 1240000,
  weekSales: 8620000,
  monthSales: 32400000,
  todayRefund: 55000,
  todayDonationCoins: 182000,
  weekDonationCoins: 1240000,
  todaySignups: 42,
  todayWithdrawals: 3,
  pendingReports: 2,
};
