import api from './auto_refresh_axios';

export interface StartVerificationResponse {
  requestId: string;
  requestToken: string;
  provider: 'dev' | 'live';
  expiresAt: string;
  startParams: {
    merchantUid: string;
    state: string;
  };
}

export interface ConfirmVerificationResponse {
  verified: boolean;
  verifiedAt: string;
}

export const startPhoneVerification = async (): Promise<StartVerificationResponse> => {
  const response = await api.post<StartVerificationResponse>(
    '/api/identity-verification/phone/start'
  );
  return response.data;
};

export const confirmPhoneVerification = async (
  requestToken: string
): Promise<ConfirmVerificationResponse> => {
  const response = await api.post<ConfirmVerificationResponse>(
    '/api/identity-verification/phone/confirm',
    { requestToken }
  );
  return response.data;
};
