'use client';
import { useCallback, useEffect, useState } from 'react';
import AdminModal from '../../components-shared/ui/AdminModal';
import MaskedField from '../../components-shared/ui/MaskedField';
import StatusBadge, { BadgeTone } from '../../components-shared/ui/StatusBadge';
import {
  extractAdminApiError,
  forceDeleteProfileImage,
  forceDeleteUser,
  forceUpdateNickname,
  getAdminUserDetail,
  toggleAdminRole,
  viewPrivacyField,
} from '@/app/_apis/admin/user';
import { createSanction, releaseSanction } from '@/app/_apis/admin/sanction';
import type {
  AdminPrivacyField,
  AdminUserDetailData,
  SanctionType,
} from '@/app/_types/admin-console';

interface UserDetailModalProps {
  userIdx: number | null;
  onClose: () => void;
  /** 계정 조작 후 목록 갱신용 콜백 */
  onUpdated?: () => void;
}

type AdminAction = 'sanction' | 'nickname' | 'profile-image' | 'admin-role' | 'force-delete';

const businessTypeLabels: Record<string, string> = {
  INDIVIDUAL: '개인',
  SOLE_PROPRIETOR: '개인사업자',
  CORPORATION: '법인',
};

const sanctionTypeLabels: Record<SanctionType, { label: string; tone: BadgeTone }> = {
  ACCOUNT_SUSPEND: { label: '계정 정지', tone: 'red' },
  BROADCAST_BAN: { label: '방송 정지', tone: 'purple' },
  WARNING: { label: '경고', tone: 'gray' },
};

const actionLabels: Record<AdminAction, string> = {
  sanction: '제재 부과',
  nickname: '닉네임 강제 변경',
  'profile-image': '프로필 이미지 삭제',
  'admin-role': '관리자 권한 변경',
  'force-delete': '강제 탈퇴',
};

export default function UserDetailModal({ userIdx, onClose, onUpdated }: UserDetailModalProps) {
  const [detail, setDetail] = useState<AdminUserDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [activeAction, setActiveAction] = useState<AdminAction | null>(null);
  const [reason, setReason] = useState<string>('');
  const [newNickname, setNewNickname] = useState<string>('');
  const [sanctionType, setSanctionType] = useState<SanctionType>('BROADCAST_BAN');
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string>('');
  const [actionMessage, setActionMessage] = useState<string>('');

  const [releasingId, setReleasingId] = useState<number | null>(null);
  const [releaseReason, setReleaseReason] = useState<string>('');
  const [releaseLoading, setReleaseLoading] = useState<boolean>(false);
  const [releaseError, setReleaseError] = useState<string>('');

  const resetActionState = (): void => {
    setActiveAction(null);
    setReason('');
    setNewNickname('');
    setSanctionType('BROADCAST_BAN');
    setActionError('');
  };

  const load = useCallback(async (): Promise<void> => {
    if (userIdx === null) return;
    setLoading(true);
    setError('');
    try {
      const data = await getAdminUserDetail(userIdx);
      setDetail(data);
    } catch (e) {
      setError(extractAdminApiError(e, '회원 상세 조회 중 오류가 발생했습니다.'));
    } finally {
      setLoading(false);
    }
  }, [userIdx]);

  useEffect(() => {
    setDetail(null);
    setActionMessage('');
    resetActionState();
    setReleasingId(null);
    setReleaseReason('');
    setReleaseError('');
    if (userIdx !== null) load();
  }, [userIdx, load]);

  // 개인정보 원문 열람 — 사유 필수, PRIVACY_VIEW 감사 로그 기록 (§16-1)
  const handleReveal = async (fieldName: string, revealReason: string): Promise<string | null> => {
    if (userIdx === null) return null;
    return await viewPrivacyField(userIdx, fieldName as AdminPrivacyField, revealReason);
  };

  const handleActionSubmit = async (): Promise<void> => {
    if (!detail || !activeAction) return;
    if (!reason.trim()) {
      setActionError('사유를 입력하세요. (감사 로그에 기록됩니다)');
      return;
    }
    if (activeAction === 'nickname' && !newNickname.trim()) {
      setActionError('변경할 닉네임을 입력하세요.');
      return;
    }

    setActionLoading(true);
    setActionError('');
    try {
      switch (activeAction) {
        case 'sanction':
          await createSanction({
            userIdx: detail.idx,
            type: sanctionType,
            reason: reason.trim(),
          });
          setActionMessage('제재를 등록했습니다.');
          break;
        case 'nickname':
          await forceUpdateNickname(detail.idx, newNickname.trim(), reason.trim());
          setActionMessage('닉네임을 강제 변경했습니다.');
          break;
        case 'profile-image':
          await forceDeleteProfileImage(detail.idx, reason.trim());
          setActionMessage('프로필 이미지를 삭제했습니다.');
          break;
        case 'admin-role':
          await toggleAdminRole(detail.idx, !detail.is_admin, reason.trim());
          setActionMessage(detail.is_admin ? '관리자 권한을 회수했습니다.' : '관리자 권한을 부여했습니다.');
          break;
        case 'force-delete':
          await forceDeleteUser(detail.idx, reason.trim());
          onUpdated?.();
          onClose();
          return;
      }
      resetActionState();
      await load();
      onUpdated?.();
    } catch (e) {
      setActionError(extractAdminApiError(e, '처리 중 오류가 발생했습니다.'));
    } finally {
      setActionLoading(false);
    }
  };

  // 제재 해제 — 해제 사유 필수, 감사 로그 기록
  const handleRelease = async (): Promise<void> => {
    if (releasingId === null) return;
    if (!releaseReason.trim()) {
      setReleaseError('해제 사유를 입력하세요. (감사 로그에 기록됩니다)');
      return;
    }
    setReleaseLoading(true);
    setReleaseError('');
    try {
      await releaseSanction(releasingId, releaseReason.trim());
      setReleasingId(null);
      setReleaseReason('');
      await load();
      onUpdated?.();
    } catch (e) {
      setReleaseError(extractAdminApiError(e, '제재 해제 중 오류가 발생했습니다.'));
    } finally {
      setReleaseLoading(false);
    }
  };

  const actionButtons: { key: AdminAction; label: string; danger?: boolean; disabled?: boolean; disabledReason?: string }[] = detail
    ? [
        { key: 'sanction', label: '제재 부과', danger: true },
        { key: 'nickname', label: '닉네임 강제 변경' },
        {
          key: 'profile-image',
          label: '프로필 이미지 삭제',
          disabled: !detail.profile_img,
          disabledReason: '프로필 이미지가 없습니다',
        },
        { key: 'admin-role', label: detail.is_admin ? '관리자 권한 회수' : '관리자 권한 부여' },
        { key: 'force-delete', label: '강제 탈퇴', danger: true },
      ]
    : [];

  // 계정 조작 모달이 열려 있으면 ESC 등으로 상세 모달까지 같이 닫히지 않게 한다
  const handleDetailClose = (): void => {
    if (activeAction) return;
    onClose();
  };

  return (
    <AdminModal
      open={userIdx !== null}
      title={`회원 상세 — ${detail?.nickname ?? ''}`}
      onClose={handleDetailClose}
    >
      {loading && (
        <div className="py-16 flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
        </div>
      )}

      {!loading && error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md px-4 py-3">
          {error}
        </p>
      )}

      {!loading && detail && (
        <div className="space-y-6">
          {/* 기본 정보 */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">기본 정보</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">user_id</div>
                <div className="font-mono font-medium text-foreground">{detail.user_id}</div>
              </div>
              <div>
                <div className="text-muted-foreground">가입일</div>
                <div className="font-medium text-foreground">{new Date(detail.created_at).toLocaleDateString('ko-KR')}</div>
              </div>
              <div>
                <div className="text-muted-foreground">본인인증</div>
                <div>{detail.is_identity_verified ? <StatusBadge label="완료 (CI 해시)" tone="green" /> : <StatusBadge label="미인증" tone="gray" />}</div>
              </div>
              <div>
                <div className="text-muted-foreground">성인인증</div>
                <div>{detail.is_adult_verified ? <StatusBadge label="완료" tone="blue" /> : <StatusBadge label="-" tone="gray" />}</div>
              </div>
              <div>
                <div className="text-muted-foreground">사업자 유형</div>
                <div className="font-medium text-foreground">{businessTypeLabels[detail.business_type] ?? detail.business_type}</div>
              </div>
              <div>
                <div className="text-muted-foreground">권한 · 방송</div>
                <div className="flex items-center gap-1.5">
                  {detail.is_admin && <StatusBadge label="관리자" tone="blue" />}
                  {detail.is_live ? <StatusBadge label="방송 중" tone="red" /> : <StatusBadge label="방송 안함" tone="gray" />}
                </div>
              </div>
            </div>
          </section>

          {/* 개인정보 (기본 마스킹, 열람 시 사유 기록 — §16-1) */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              개인정보 <span className="normal-case font-normal">(열람 시 사유가 감사 로그에 기록됩니다)</span>
            </h3>
            {detail.userDetail ? (
              <div className="grid grid-cols-2 gap-4">
                <MaskedField label="이름" value={detail.userDetail.name ?? '-'} fieldName="name" onReveal={handleReveal} />
                <MaskedField label="전화번호" value={detail.userDetail.phone ?? '-'} fieldName="phone" onReveal={handleReveal} />
                <MaskedField label="이메일" value={detail.userDetail.email ?? '-'} fieldName="email" onReveal={handleReveal} />
                <MaskedField label="주소" value={detail.userDetail.address ?? '-'} fieldName="address" onReveal={handleReveal} />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">등록된 개인정보가 없습니다. (본인인증 미완료)</p>
            )}
          </section>

          {/* 코인 잔액 */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">코인</h3>
            <div className="grid grid-cols-4 gap-3">
              {([
                ['보유', detail.coinBalance?.coin_balance ?? 0],
                ['총 충전', detail.coinBalance?.total_charged ?? 0],
                ['총 사용', detail.coinBalance?.total_used ?? 0],
                ['총 수령', detail.coinBalance?.total_received ?? 0],
              ] as const).map(([label, value]) => (
                <div key={label} className="px-3 py-2 rounded-md bg-muted/50 border border-border">
                  <div className="text-xs text-muted-foreground">{label}</div>
                  <div className="font-semibold text-foreground">{value.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </section>

          {/* 채널/팬 */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">채널 · 팬</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">채널명</div>
                <div className="font-medium text-foreground">{detail.channel?.title || '-'}</div>
              </div>
              <div>
                <div className="text-muted-foreground">팬</div>
                <div className="font-medium text-foreground">{detail.counts.fans.toLocaleString()}명</div>
              </div>
              <div>
                <div className="text-muted-foreground">팔로잉</div>
                <div className="font-medium text-foreground">{detail.counts.following.toLocaleString()}명</div>
              </div>
            </div>
          </section>

          {/* 제재 이력 */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">제재 이력</h3>
            {detail.sanctions.length === 0 ? (
              <p className="text-sm text-muted-foreground">제재 이력이 없습니다.</p>
            ) : (
              <ul className="space-y-2">
                {detail.sanctions.map((sanction) => (
                  <li key={sanction.id} className="space-y-2 px-3 py-2 rounded-md bg-muted/50 border border-border text-sm">
                    <div className="flex items-start gap-2">
                      <StatusBadge
                        label={sanctionTypeLabels[sanction.type]?.label ?? sanction.type}
                        tone={sanction.is_active ? sanctionTypeLabels[sanction.type]?.tone ?? 'gray' : 'gray'}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-foreground">{sanction.reason}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(sanction.created_at).toLocaleDateString('ko-KR')}
                          {' · '}
                          {sanction.is_active ? '적용 중 (해제 전까지 유지)' : '해제됨'}
                        </div>
                      </div>
                      {sanction.is_active && (
                        <button
                          onClick={() => {
                            setReleaseError('');
                            setReleaseReason('');
                            setReleasingId((prev) => (prev === sanction.id ? null : sanction.id));
                          }}
                          disabled={releaseLoading}
                          className="shrink-0 px-3 py-1 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-50 transition-colors"
                        >
                          해제
                        </button>
                      )}
                    </div>
                    {releasingId === sanction.id && (
                      <div className="space-y-2 pt-1 border-t border-border">
                        <input
                          type="text"
                          value={releaseReason}
                          onChange={(e) => setReleaseReason(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleRelease()}
                          placeholder="해제 사유 입력 (감사 로그에 기록됩니다)"
                          className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        {releaseError && <p className="text-xs text-red-500">{releaseError}</p>}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleRelease}
                            disabled={releaseLoading}
                            className="px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
                          >
                            {releaseLoading ? '처리 중...' : '제재 해제'}
                          </button>
                          <button
                            onClick={() => setReleasingId(null)}
                            disabled={releaseLoading}
                            className="px-3 py-1.5 text-xs rounded-md text-muted-foreground hover:text-foreground transition-colors"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* 계정 조작 (§3-3) */}
          <section className="space-y-3 pt-2 border-t border-border">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">계정 조작</h3>

            {actionMessage && (
              <p className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-md px-3 py-2">
                {actionMessage}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {actionButtons.map(({ key, label, danger, disabled, disabledReason }) => (
                <button
                  key={key}
                  disabled={disabled || actionLoading}
                  title={disabled ? disabledReason : undefined}
                  onClick={() => {
                    setActionMessage('');
                    setActionError('');
                    setActiveAction(key);
                  }}
                  className={`px-3 py-1.5 text-sm rounded-md border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    danger
                      ? 'border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                      : 'border-border text-foreground hover:bg-accent'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

          </section>

          {/* 계정 조작 실행 모달 */}
          <AdminModal
            open={activeAction !== null}
            title={activeAction ? actionLabels[activeAction] : ''}
            onClose={() => {
              if (!actionLoading) resetActionState();
            }}
            maxWidthClass="max-w-md"
            footer={
              <>
                <button
                  onClick={resetActionState}
                  disabled={actionLoading}
                  className="px-4 py-2 text-sm rounded-md border border-border text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleActionSubmit}
                  disabled={actionLoading}
                  className={`px-4 py-2 text-sm font-medium rounded-md disabled:opacity-50 transition-colors ${
                    activeAction === 'force-delete' || activeAction === 'sanction'
                      ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  {actionLoading
                    ? '처리 중...'
                    : activeAction === 'force-delete'
                      ? '강제 탈퇴 확정'
                      : activeAction === 'sanction'
                        ? '제재 적용'
                        : '실행'}
                </button>
              </>
            }
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                대상: <span className="font-medium text-foreground">{detail.nickname}</span>
                {' '}
                <span className="font-mono text-xs">({detail.user_id})</span>
              </p>

              {activeAction === 'force-delete' && (
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md px-3 py-2">
                  강제 탈퇴는 되돌릴 수 없으며, NCP 채널 정리를 포함한 탈퇴 플로우가 즉시 실행됩니다.
                </p>
              )}

              {activeAction === 'sanction' && (
                <>
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">제재 유형</label>
                    <select
                      value={sanctionType}
                      onChange={(e) => setSanctionType(e.target.value as SanctionType)}
                      className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="BROADCAST_BAN">방송 권한 정지</option>
                      <option value="ACCOUNT_SUSPEND">계정 정지</option>
                      <option value="WARNING">경고</option>
                    </select>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    제재는 관리자가 해제하기 전까지 유지되며, 적용 시 대상 유저의 활성 세션/소켓이 강제 종료됩니다.
                  </p>
                </>
              )}

              {activeAction === 'nickname' && (
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">변경할 닉네임</label>
                  <input
                    type="text"
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    placeholder="새 닉네임 입력"
                    className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              )}

              {activeAction === 'admin-role' && (
                <p className="text-sm text-muted-foreground">
                  {detail.is_admin
                    ? '이 회원의 관리자 권한을 회수합니다.'
                    : '이 회원에게 관리자 권한을 부여합니다.'}
                </p>
              )}

              {activeAction === 'profile-image' && (
                <p className="text-sm text-muted-foreground">현재 프로필 이미지를 삭제합니다.</p>
              )}

              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">사유 (필수)</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleActionSubmit()}
                  placeholder="사유 입력 (감사 로그에 기록됩니다)"
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {actionError && <p className="text-xs text-red-500">{actionError}</p>}
            </div>
          </AdminModal>
        </div>
      )}
    </AdminModal>
  );
}
