'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ExchangeContentSkeleton from './ExchangeContentSkeleton';
import { getPayoutSummary } from '@/app/_apis/payout-coin';
import { createSettlement, getMySettlements, getMySettlementStats } from '@/app/_apis/settlement';
import {
  getMySettlementAccount,
  upsertSettlementAccount,
  verifySettlementAccount,
} from '@/app/_apis/settlement-account';
import type { PayoutSummary } from '@/app/_types/payout-coin';
import type {
  Settlement,
  SettlementStats,
  SettlementStatus,
  SettlementAccount,
} from '@/app/_types/settlement';
import {
  MdAccountBalanceWallet, MdAccessTime, MdLoop, MdBlock,
  MdCheckCircle, MdTrendingUp, MdRefresh, MdInfoOutline,
  MdEdit, MdVerified, MdWarning, MdAdd,
} from 'react-icons/md';
import { AxiosError } from 'axios';

const SETTLEMENT_STATUS_LABEL: Record<SettlementStatus, string> = {
  PENDING: '처리 중',
  APPROVED: '승인됨',
  PAID: '정산 완료',
  REJECTED: '거절됨',
};

const SETTLEMENT_STATUS_CLASS: Record<SettlementStatus, string> = {
  PENDING: 'bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/30',
  APPROVED: 'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30',
  PAID: 'bg-green-500/15 text-green-400 ring-1 ring-green-500/30',
  REJECTED: 'bg-red-500/15 text-red-400 ring-1 ring-red-500/30',
};

const KOREAN_BANKS = [
  { code: '004', name: 'KB국민은행' },
  { code: '020', name: '우리은행' },
  { code: '088', name: '신한은행' },
  { code: '081', name: 'KEB하나은행' },
  { code: '011', name: 'NH농협은행' },
  { code: '003', name: 'IBK기업은행' },
  { code: '002', name: 'KDB산업은행' },
  { code: '007', name: '수협은행' },
  { code: '023', name: 'SC제일은행' },
  { code: '032', name: '부산은행' },
  { code: '034', name: '광주은행' },
  { code: '035', name: '전북은행' },
  { code: '037', name: '제주은행' },
  { code: '039', name: '경남은행' },
  { code: '045', name: '새마을금고' },
  { code: '048', name: '신협' },
  { code: '064', name: '산림조합' },
  { code: '071', name: '우체국' },
  { code: '089', name: '케이뱅크' },
  { code: '090', name: '카카오뱅크' },
  { code: '092', name: '토스뱅크' },
];

function formatCurrency(value: number) {
  return value.toLocaleString('ko-KR') + '원';
}

function formatCoin(count: number) {
  return count.toLocaleString('ko-KR') + '개';
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  });
}

function extractApiError(err: unknown): string {
  if (err instanceof AxiosError) {
    const msg = err.response?.data?.message;
    if (typeof msg === 'string') return msg;
  }
  return '요청 처리 중 오류가 발생했습니다.';
}

const HISTORY_FILTER_TABS: { label: string; value: SettlementStatus | undefined }[] = [
  { label: '전체', value: undefined },
  { label: '처리 중', value: 'PENDING' },
  { label: '승인됨', value: 'APPROVED' },
  { label: '정산 완료', value: 'PAID' },
  { label: '거절됨', value: 'REJECTED' },
];

// ── 정산 계좌 폼 ──────────────────────────────────────────────────────────

interface AccountFormState {
  bank_code: string;
  bank_name: string;
  account_number: string;
  holder_name: string;
}

const EMPTY_FORM: AccountFormState = {
  bank_code: '',
  bank_name: '',
  account_number: '',
  holder_name: '',
};

interface SettlementAccountSectionProps {
  account: SettlementAccount | null;
  onSaved: (account: SettlementAccount) => void;
}

const SettlementAccountSection: React.FC<SettlementAccountSectionProps> = ({ account, onSaved }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<AccountFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifyResult, setVerifyResult] = useState<string | null>(null);

  const hasAccount = !!account;
  const isVerified = account?.verification_status === 'VERIFIED';
  const isPending = account?.verification_status === 'PENDING';

  const startEdit = () => {
    setForm({
      bank_code: account?.bank_code ?? '',
      bank_name: account?.bank_name ?? '',
      account_number: '',
      holder_name: '',
    });
    setError(null);
    setVerifyResult(null);
    setEditing(true);
  };

  const handleBankSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = KOREAN_BANKS.find((b) => b.code === e.target.value);
    setForm((prev) => ({
      ...prev,
      bank_code: selected?.code ?? '',
      bank_name: selected?.name ?? '',
    }));
  };

  const handleSave = async () => {
    if (!form.bank_code || !form.account_number) {
      setError('은행과 계좌번호를 입력해주세요.');
      return;
    }
    try {
      setSaving(true);
      setError(null);
      const res = await upsertSettlementAccount({
        bank_code: form.bank_code,
        bank_name: form.bank_name,
        account_number: form.account_number,
        holder_name: form.holder_name || undefined,
      });
      onSaved(res.data);
      setEditing(false);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleVerify = async () => {
    try {
      setVerifying(true);
      setError(null);
      setVerifyResult(null);
      const res = await verifySettlementAccount();
      if (res.data.verification_status === 'VERIFIED') {
        setVerifyResult('계좌 인증이 완료되었습니다.');
        // Refresh account data via parent
        const updated = await getMySettlementAccount();
        onSaved(updated.data);
      } else {
        setVerifyResult(`인증 실패${res.data.failure_reason ? ': ' + res.data.failure_reason : ''}`);
      }
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setVerifying(false);
    }
  };

  const verificationBadge = () => {
    if (!account) return null;
    const map = {
      VERIFIED: { label: '인증 완료', cls: 'bg-green-500/15 text-green-400 ring-1 ring-green-500/30' },
      PENDING: { label: '인증 중', cls: 'bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/30' },
      UNVERIFIED: { label: '미인증', cls: 'bg-text-secondary/10 text-text-secondary ring-1 ring-border-primary' },
      FAILED: { label: '인증 실패', cls: 'bg-red-500/15 text-red-400 ring-1 ring-red-500/30' },
    } as const;
    const { label, cls } = map[account.verification_status];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
        {account.verification_status === 'VERIFIED' && <MdVerified className="w-3 h-3" />}
        {label}
      </span>
    );
  };

  return (
    <div className="rounded-xl bg-bg-secondary border border-border-primary overflow-hidden">
      <div className="px-6 py-4 border-b border-border-primary flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MdAccountBalanceWallet className="w-4 h-4 text-accent" />
          <h3 className="font-semibold text-text-primary text-sm">정산 계좌</h3>
        </div>
        {hasAccount && !editing && (
          <button
            onClick={startEdit}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
          >
            <MdEdit className="w-3.5 h-3.5" />
            수정
          </button>
        )}
      </div>

      <div className="px-6 py-5">
        {/* 오류/결과 메시지 */}
        {error && (
          <div className="mb-4 flex items-start gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 text-red-400 ring-1 ring-red-500/20 text-xs">
            <MdWarning className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            {error}
          </div>
        )}
        {verifyResult && (
          <div className={`mb-4 flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs ring-1 ${
            verifyResult.includes('완료')
              ? 'bg-green-500/10 text-green-400 ring-green-500/20'
              : 'bg-red-500/10 text-red-400 ring-red-500/20'
          }`}>
            <span>{verifyResult}</span>
          </div>
        )}

        {/* 등록된 계좌 표시 */}
        {hasAccount && !editing && (
          <div className="space-y-3">
            <div className="rounded-lg bg-bg-tertiary border border-border-primary divide-y divide-border-primary">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs text-text-secondary">은행</span>
                <span className="text-sm font-medium text-text-primary">{account.bank_name}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs text-text-secondary">계좌번호</span>
                <span className="text-sm font-medium text-text-primary tabular-nums">{account.account_number_masked}</span>
              </div>
              {account.holder_name_masked && (
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-text-secondary">예금주</span>
                  <span className="text-sm font-medium text-text-primary">{account.holder_name_masked}</span>
                </div>
              )}
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs text-text-secondary">인증 상태</span>
                {verificationBadge()}
              </div>
              {account.verified_at && (
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-text-secondary">인증일</span>
                  <span className="text-xs text-text-secondary">{formatDate(account.verified_at)}</span>
                </div>
              )}
            </div>

            {!isVerified && !isPending && (
              <button
                onClick={handleVerify}
                disabled={verifying}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium
                  bg-accent/10 text-accent hover:bg-accent/20 transition-colors border border-accent/20
                  disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <MdVerified className="w-4 h-4" />
                {verifying ? '인증 중...' : '계좌 인증하기'}
              </button>
            )}
            {isPending && (
              <p className="text-xs text-text-secondary text-center py-1">계좌 인증이 진행 중입니다.</p>
            )}
          </div>
        )}

        {/* 계좌 미등록 상태 */}
        {!hasAccount && !editing && (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center">
              <MdAccountBalanceWallet className="w-5 h-5 text-text-secondary opacity-50" />
            </div>
            <p className="text-sm text-text-secondary">등록된 정산 계좌가 없습니다.</p>
            <p className="text-xs text-text-secondary opacity-70">정산 신청을 위해 계좌를 먼저 등록해주세요.</p>
            <button
              onClick={startEdit}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium
                bg-accent text-white hover:bg-accent-light transition-colors"
            >
              <MdAdd className="w-4 h-4" />
              계좌 등록하기
            </button>
          </div>
        )}

        {/* 계좌 등록/수정 폼 */}
        {editing && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1.5">은행 선택</label>
              <select
                value={form.bank_code}
                onChange={handleBankSelect}
                className="w-full px-3 py-2.5 rounded-lg bg-bg-tertiary border border-border-primary text-text-primary text-sm
                  focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="">은행을 선택하세요</option>
                {KOREAN_BANKS.map((b) => (
                  <option key={b.code} value={b.code}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-text-secondary mb-1.5">계좌번호 <span className="text-red-400">*</span></label>
              <input
                type="text"
                inputMode="numeric"
                value={form.account_number}
                onChange={(e) => setForm((prev) => ({ ...prev, account_number: e.target.value.replace(/[^0-9-]/g, '') }))}
                placeholder="계좌번호를 입력하세요 (숫자만)"
                className="w-full px-3 py-2.5 rounded-lg bg-bg-tertiary border border-border-primary text-text-primary text-sm tabular-nums
                  focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-text-secondary/40"
              />
            </div>

            <div>
              <label className="block text-xs text-text-secondary mb-1.5">예금주명 <span className="text-text-secondary/50">(선택)</span></label>
              <input
                type="text"
                value={form.holder_name}
                onChange={(e) => setForm((prev) => ({ ...prev, holder_name: e.target.value }))}
                placeholder="예금주 성명"
                className="w-full px-3 py-2.5 rounded-lg bg-bg-tertiary border border-border-primary text-text-primary text-sm
                  focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-text-secondary/40"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => { setEditing(false); setError(null); }}
                disabled={saving}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium text-text-secondary
                  bg-bg-tertiary hover:bg-bg-primary border border-border-primary transition-colors
                  disabled:opacity-40"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.bank_code || !form.account_number}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold
                  bg-accent hover:bg-accent-light text-white transition-colors
                  disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── 메인 컴포넌트 ────────────────────────────────────────────────────────────

export const ExchangeContent = () => {
  const [summary, setSummary] = useState<PayoutSummary | null>(null);
  const [stats, setStats] = useState<SettlementStats | null>(null);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [account, setAccount] = useState<SettlementAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [amountInput, setAmountInput] = useState('');
  const [filterStatus, setFilterStatus] = useState<SettlementStatus | undefined>(undefined);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchData = useCallback(async (status?: SettlementStatus) => {
    try {
      setLoading(true);
      setError(null);
      const [summaryRes, statsRes, settlementsRes, accountRes] = await Promise.allSettled([
        getPayoutSummary(),
        getMySettlementStats(),
        getMySettlements({ limit: 20, status }),
        getMySettlementAccount(),
      ]);
      if (summaryRes.status === 'fulfilled') setSummary(summaryRes.value.data);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
      if (settlementsRes.status === 'fulfilled') setSettlements(settlementsRes.value.data?.settlements ?? []);
      if (accountRes.status === 'fulfilled') setAccount(accountRes.value.data);
      else setAccount(null);
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(filterStatus); }, [fetchData, filterStatus]);

  const isAccountVerified = account?.verification_status === 'VERIFIED';
  const availableCount = Math.floor((summary?.available_amount ?? 0) / 100);
  const enteredCount = Math.min(Math.max(0, Number(amountInput) || 0), availableCount);
  const enteredAmount = enteredCount * 100;
  // 백엔드 calculateAmounts 로직과 동일하게 산정 (원천징수 대상 가정)
  const feeValue = Math.floor(enteredAmount * 0.1);
  const taxBase = enteredAmount - feeValue;
  const incomeTax = Math.floor(taxBase * 0.03);
  const localTax = Math.floor(incomeTax * 0.1);
  const withholdingTax = incomeTax + localTax;
  const netValue = enteredAmount - feeValue - withholdingTax;
  const canSettle = enteredCount > 0 && availableCount > 0 && isAccountVerified;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/[^0-9]/g, '');
    const num = Number(v);
    setAmountInput(num > availableCount ? String(availableCount) : v);
  };

  const handleSetMax = () => setAmountInput(String(availableCount));

  const handleRequestSettlement = async () => {
    if (!canSettle) return;
    try {
      setRequesting(true);
      setError(null);
      setSuccessMessage(null);
      // 백엔드는 amount 를 신청 코인 수(코인 개수)로 해석한다
      const res = await createSettlement({ amount: enteredCount });
      setSuccessMessage(
        `정산이 신청되었습니다. 신청 코인 ${formatCoin(Math.floor(res.data.total_value / 100))} (${formatCurrency(res.data.total_value)}), 예상 지급액 ${formatCurrency(res.data.payout_amount)}`,
      );
      setAmountInput('');
      await fetchData(filterStatus);
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setRequesting(false);
    }
  };

  const handleFilterChange = (status: SettlementStatus | undefined) => {
    setFilterStatus(status);
    setExpandedId(null);
  };

  if (loading) return <ExchangeContentSkeleton />;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* 페이지 헤더 */}
      <div className="pb-4 border-b border-border-primary flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">수익 정산</h2>
          <p className="text-sm mt-1 text-text-secondary">후원 코인을 원화로 전환 신청하고 정산 내역을 확인하세요.</p>
        </div>
        <button
          onClick={() => fetchData(filterStatus)}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
          title="새로고침"
        >
          <MdRefresh className="w-4 h-4" />
        </button>
      </div>

      {/* 알림 */}
      {error && (
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 ring-1 ring-red-500/20 text-sm">
          <span className="shrink-0 mt-0.5">⚠</span>
          <p>{error}</p>
        </div>
      )}
      {successMessage && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-green-500/10 text-green-400 ring-1 ring-green-500/20 text-sm">
          <span className="shrink-0">✓</span>{successMessage}
        </div>
      )}

      {/* 정산 계좌 섹션 */}
      <SettlementAccountSection
        account={account}
        onSaved={(updated) => setAccount(updated)}
      />

      {/* 정산 신청 카드 */}
      <div className="rounded-xl bg-bg-secondary border border-border-primary overflow-hidden">
        {/* 정산 가능 금액 강조 */}
        <div className="px-6 pt-6 pb-5 border-b border-border-primary">
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">정산 가능 코인</p>
          <p className="text-4xl font-bold text-accent tabular-nums">
            {formatCoin(availableCount)}
          </p>
          <p className="text-xs text-text-secondary mt-2 flex items-center gap-1">
            <MdInfoOutline className="w-3.5 h-3.5 shrink-0" />
            1개 = 100원 / 수수료 10% · 원천징수 3.3% 적용 전
          </p>
        </div>

        <div className="px-6 py-5">
          <h3 className="font-semibold text-text-primary text-sm mb-5">정산 신청</h3>

          {/* 계좌 미인증 안내 */}
          {!isAccountVerified && (
            <div className="mb-5 flex items-start gap-2 px-4 py-3 rounded-lg bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/20 text-xs">
              <MdWarning className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                {!account
                  ? '정산 계좌를 먼저 등록하고 인증을 완료해야 신청할 수 있습니다.'
                  : '계좌 인증을 완료해야 정산 신청이 가능합니다.'}
              </span>
            </div>
          )}

          {/* 금액 입력 */}
          <div className="mb-5">
            <label className="block text-xs text-text-secondary mb-1.5">신청 코인 수</label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={amountInput}
                onChange={handleInputChange}
                placeholder="0"
                disabled={availableCount === 0 || !isAccountVerified}
                className="w-full px-4 py-3 pr-24 rounded-lg bg-bg-tertiary border border-border-primary text-text-primary text-sm tabular-nums
                  focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-text-secondary/40
                  disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-xs text-text-secondary">개</span>
                <button
                  onClick={handleSetMax}
                  disabled={availableCount === 0 || !isAccountVerified}
                  className="text-xs px-2 py-1 rounded bg-accent/20 text-accent hover:bg-accent/30 transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  전액
                </button>
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-1.5">
              최대 {formatCoin(availableCount)} 신청 가능
            </p>
          </div>

          {/* 계산 결과 */}
          <div className="rounded-lg bg-bg-tertiary border border-border-primary divide-y divide-border-primary">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-text-secondary">신청 코인</span>
              <span className="text-sm font-medium text-text-primary tabular-nums">{formatCoin(enteredCount)}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-text-secondary">코인 환산 금액</span>
              <span className="text-sm font-medium text-text-primary tabular-nums">{formatCurrency(enteredAmount)}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-text-secondary">수수료 (10%)</span>
              <span className="text-sm text-red-400 tabular-nums">−{formatCurrency(feeValue)}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-text-secondary">원천징수 (소득세+지방세 3.3%)</span>
              <span className="text-sm text-red-400 tabular-nums">−{formatCurrency(withholdingTax)}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3.5 bg-bg-secondary rounded-b-lg">
              <span className="text-sm font-semibold text-text-primary">예상 지급액</span>
              <span className={`text-lg font-bold tabular-nums ${canSettle ? 'text-accent' : 'text-text-secondary'}`}>
                {formatCurrency(netValue)}
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 pb-5">
          <button
            onClick={handleRequestSettlement}
            disabled={requesting || !canSettle}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all
              bg-accent hover:bg-accent-light text-white
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <MdAccountBalanceWallet className="w-4 h-4" />
            {requesting ? '신청 중...' : '정산 신청하기'}
          </button>
        </div>
      </div>

      {/* 코인 상태 요약 */}
      <div className="rounded-xl bg-bg-secondary border border-border-primary grid grid-cols-2 sm:grid-cols-4 divide-x-0 sm:divide-x divide-y sm:divide-y-0 divide-border-primary">
        <StatusCell
          icon={<MdAccessTime className="w-3.5 h-3.5" />}
          label="정산 대기"
          coinCount={Math.floor((summary?.waiting_amount ?? 0) / 100)}
          color="yellow"
          hint="후원 후 3일 대기 중"
        />
        <StatusCell
          icon={<MdLoop className="w-3.5 h-3.5" />}
          label="정산 중"
          coinCount={Math.floor((summary?.in_settlement_amount ?? 0) / 100)}
          color="blue"
          hint="관리자 처리 중"
        />
        <StatusCell
          icon={<MdBlock className="w-3.5 h-3.5" />}
          label="정산 보류"
          coinCount={Math.floor((summary?.blocked_amount ?? 0) / 100)}
          color="red"
          hint="컴플라이언스 검토"
        />
        <StatusCell
          icon={<MdCheckCircle className="w-3.5 h-3.5" />}
          label="누적 지급"
          coinCount={Math.floor((summary?.completed_amount ?? 0) / 100)}
          color="green"
          hint="누적 지급 완료 코인"
        />
      </div>

      {/* 정산 통계 */}
      {stats && (
        <div className="rounded-xl bg-bg-secondary border border-border-primary p-5">
          <div className="flex items-center gap-2 mb-4">
            <MdTrendingUp className="w-4 h-4 text-accent" />
            <h3 className="font-semibold text-text-primary text-sm">정산 통계</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <StatItem label="누적 지급" amount={stats.total_paid_amount} count={stats.total_paid_count} highlight />
            <StatItem label="검토 중" amount={stats.pending_amount} count={stats.pending_count} />
            <StatItem label="승인됨" amount={stats.approved_amount} count={stats.approved_count} />
          </div>
        </div>
      )}

      {/* 정산 내역 */}
      <div className="rounded-xl bg-bg-secondary border border-border-primary">
        {/* 헤더 + 필터 탭 */}
        <div className="px-5 pt-4 pb-0 border-b border-border-primary">
          <h3 className="font-semibold text-text-primary text-sm mb-3">정산 내역</h3>
          <div className="flex gap-1 overflow-x-auto pb-px">
            {HISTORY_FILTER_TABS.map((tab) => (
              <button
                key={tab.label}
                onClick={() => handleFilterChange(tab.value)}
                className={`shrink-0 px-3 py-1.5 rounded-t-md text-xs font-medium transition-colors border-b-2
                  ${filterStatus === tab.value
                    ? 'border-accent text-accent bg-accent/10'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {settlements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <MdAccountBalanceWallet className="w-8 h-8 text-text-secondary opacity-40" />
            <p className="text-sm text-text-secondary">정산 내역이 없습니다.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border-primary">
            {settlements.map((s) => (
              <React.Fragment key={s.id}>
                <li
                  className={`px-5 py-4 cursor-pointer hover:bg-bg-tertiary transition-colors ${expandedId === s.id ? 'bg-bg-tertiary' : ''}`}
                  onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`inline-flex shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${SETTLEMENT_STATUS_CLASS[s.status]}`}>
                          {SETTLEMENT_STATUS_LABEL[s.status]}
                        </span>
                        <span className="text-xs text-text-secondary tabular-nums">{formatDate(s.requested_at)}</span>
                      </div>
                      <p className="text-xs text-text-secondary tabular-nums">
                        신청 {formatCurrency(s.total_value)} · 수수료 −{formatCurrency(s.fee_amount)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-text-primary tabular-nums text-sm">{formatCurrency(s.payout_amount)}</p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {s.status === 'PAID' && s.paid_at ? `지급 ${formatDate(s.paid_at)}` :
                         s.status === 'APPROVED' && s.approved_at ? `승인 ${formatDate(s.approved_at)}` :
                         s.status === 'REJECTED' && s.rejected_at ? `거절 ${formatDate(s.rejected_at)}` : ''}
                      </p>
                    </div>
                  </div>
                </li>
                {expandedId === s.id && (
                  <li className="border-t border-border-primary bg-bg-tertiary/50 px-5 py-4 space-y-3">
                    {/* 금액 분해 (서버 값 그대로 표기) */}
                    <dl className="rounded-lg bg-bg-secondary border border-border-primary divide-y divide-border-primary text-sm">
                      <SettlementAmountRow label="정산 총액" value={s.total_value} />
                      <SettlementAmountRow label="플랫폼 수수료" value={-s.fee_amount} negative />
                      {s.withholding_tax_amount > 0 && (
                        <SettlementAmountRow
                          label="원천징수 (소득세+지방세 3.3%)"
                          value={-s.withholding_tax_amount}
                          negative
                        />
                      )}
                      <SettlementAmountRow label="실지급액" value={s.payout_amount} emphasis />
                    </dl>

                    {/* 거절 사유 */}
                    {s.status === 'REJECTED' && s.reject_reason && (
                      <div className="flex items-start gap-2 text-xs px-1">
                        <span className="shrink-0 font-medium text-red-400">거절 사유</span>
                        <span className="text-text-secondary">{s.reject_reason}</span>
                      </div>
                    )}

                    {/* 부가 정보 */}
                    <div className="flex flex-wrap gap-4 text-xs text-text-secondary px-1">
                      <span>ID: <span className="text-text-primary font-mono text-[10px]">{s.id}</span></span>
                      {s.approved_at && <span>승인일: {formatDate(s.approved_at)}</span>}
                      {s.paid_at && <span>지급일: {formatDate(s.paid_at)}</span>}
                    </div>
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// ── 서브 컴포넌트 ───────────────────────────────────────────────────────────

interface StatusCellProps {
  icon: React.ReactNode;
  label: string;
  coinCount: number;
  color: 'yellow' | 'blue' | 'red' | 'green';
  hint: string;
}

const COLOR_MAP: Record<StatusCellProps['color'], string> = {
  yellow: 'text-yellow-400',
  blue: 'text-blue-400',
  red: 'text-red-400',
  green: 'text-green-400',
};

const StatusCell: React.FC<StatusCellProps> = ({ icon, label, coinCount, color, hint }) => (
  <div className="flex flex-col gap-1 px-4 py-3.5" title={hint}>
    <div className={`flex items-center gap-1.5 text-xs ${COLOR_MAP[color]}`}>
      {icon}
      <span>{label}</span>
    </div>
    <p className="text-base font-bold text-text-primary tabular-nums">
      {formatCoin(coinCount)}
    </p>
  </div>
);

interface SettlementAmountRowProps {
  label: string;
  value: number;
  negative?: boolean;
  emphasis?: boolean;
}

const SettlementAmountRow: React.FC<SettlementAmountRowProps> = ({ label, value, negative, emphasis }) => (
  <div className={`flex items-center justify-between px-4 py-2.5 ${emphasis ? 'bg-bg-tertiary' : ''}`}>
    <dt className={`text-xs ${emphasis ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}>{label}</dt>
    <dd className={`tabular-nums ${
      emphasis ? 'text-sm font-bold text-accent'
        : negative ? 'text-sm text-red-400'
        : 'text-sm font-medium text-text-primary'
    }`}>
      {negative ? '−' + formatCurrency(Math.abs(value)) : formatCurrency(value)}
    </dd>
  </div>
);

interface StatItemProps {
  label: string;
  amount: number;
  count: number;
  highlight?: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ label, amount, count, highlight }) => (
  <div className="flex flex-col gap-1 text-center p-3 rounded-lg bg-bg-tertiary">
    <p className="text-xs text-text-secondary">{label}</p>
    <p className={`font-bold tabular-nums text-sm ${highlight ? 'text-accent' : 'text-text-primary'}`}>
      {formatCurrency(amount)}
    </p>
    <p className="text-xs text-text-secondary">{count}건</p>
  </div>
);
