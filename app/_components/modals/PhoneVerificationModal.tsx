'use client';

import React, { useState } from 'react';
import { MdPhoneAndroid, MdVerified, MdError } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import {
  startPhoneVerification,
  confirmPhoneVerification,
} from '@/app/_apis/identity-verification';
import { useUserStore } from '@/app/_lib/stores';
import { AxiosError } from 'axios';

type VerificationStatus = 'idle' | 'loading' | 'success' | 'error' | 'unsupported';

interface PhoneVerificationModalProps {
  closeModal?: () => void;
}

export default function PhoneVerificationModal({ closeModal }: PhoneVerificationModalProps) {
  const [status, setStatus] = useState<VerificationStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const setIdentityVerified = useUserStore((state) => state.setIdentityVerified);

  const handleStart = async () => {
    setStatus('loading');
    setErrorMessage('');

    try {
      const started = await startPhoneVerification();

      if (started.provider === 'live') {
        setStatus('unsupported');
        return;
      }

      // dev 모드: 외부 인증 없이 바로 confirm
      const result = await confirmPhoneVerification(started.requestToken);

      if (result.verified) {
        setIdentityVerified(true);
        setStatus('success');
      } else {
        setErrorMessage('본인인증 검증에 실패했습니다. 다시 시도해 주세요.');
        setStatus('error');
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const statusCode = axiosError.response?.status;

      if (statusCode === 409) {
        setErrorMessage('이미 다른 계정으로 본인인증된 사용자입니다. 고객센터에 문의해 주세요.');
      } else if (statusCode === 503) {
        setStatus('unsupported');
        return;
      } else {
        setErrorMessage(
          axiosError.response?.data?.message ?? '본인인증 중 오류가 발생했습니다. 다시 시도해 주세요.'
        );
      }

      setStatus('error');
    }
  };

  return (
    <div className="w-[340px] p-6 flex flex-col items-center gap-5">
      {status === 'idle' && (
        <>
          <MdPhoneAndroid className="w-12 h-12 text-primary" />
          <div className="text-center">
            <p className="text-text-primary font-semibold text-base">휴대폰 본인인증</p>
            <p className="text-text-muted dark:text-text-muted-dark text-sm mt-1">
              서비스 이용을 위해 휴대폰 본인인증이 필요합니다.
            </p>
          </div>
          <button
            onClick={handleStart}
            className="w-full py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            본인인증 시작하기
          </button>
        </>
      )}

      {status === 'loading' && (
        <>
          <AiOutlineLoading3Quarters className="w-12 h-12 text-primary animate-spin" />
          <p className="text-text-primary text-sm text-center">본인인증을 진행 중입니다...</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="relative w-16 h-16 flex items-center justify-center">
            <MdPhoneAndroid className="w-full h-full text-success dark:text-success-dark" />
            <MdVerified className="absolute bottom-0 right-0 w-6 h-6 text-success dark:text-success-dark" />
          </div>
          <div className="text-center">
            <p className="text-text-primary font-semibold text-base">본인인증 완료</p>
            <p className="text-text-muted dark:text-text-muted-dark text-sm mt-1">
              휴대폰 본인인증이 성공적으로 완료되었습니다.
            </p>
          </div>
          <button
            onClick={closeModal}
            className="w-full py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            확인
          </button>
        </>
      )}

      {status === 'error' && (
        <>
          <MdError className="w-12 h-12 text-error dark:text-error-dark" />
          <div className="text-center">
            <p className="text-text-primary font-semibold text-base">본인인증 실패</p>
            <p className="text-text-muted dark:text-text-muted-dark text-sm mt-1">{errorMessage}</p>
          </div>
          <div className="flex gap-2 w-full">
            <button
              onClick={closeModal}
              className="flex-1 py-2 rounded-lg border border-border-primary text-text-primary text-sm hover:bg-bg-hover dark:hover:bg-bg-hover-dark transition-colors"
            >
              닫기
            </button>
            {!errorMessage.includes('고객센터') && (
              <button
                onClick={handleStart}
                className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                다시 시도
              </button>
            )}
          </div>
        </>
      )}

      {status === 'unsupported' && (
        <>
          <MdPhoneAndroid className="w-12 h-12 text-text-muted dark:text-text-muted-dark" />
          <div className="text-center">
            <p className="text-text-primary font-semibold text-base">서비스 준비 중</p>
            <p className="text-text-muted dark:text-text-muted-dark text-sm mt-1">
              현재 본인인증 서비스를 준비 중입니다. 잠시 후 다시 시도해 주세요.
            </p>
          </div>
          <button
            onClick={closeModal}
            className="w-full py-2 rounded-lg border border-border-primary text-text-primary text-sm hover:bg-bg-hover dark:hover:bg-bg-hover-dark transition-colors"
          >
            닫기
          </button>
        </>
      )}
    </div>
  );
}
