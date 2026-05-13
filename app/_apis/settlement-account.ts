import api from './auto_refresh_axios';
import type {
  SettlementAccountResponse,
  UpsertSettlementAccountRequest,
  VerifySettlementAccountResponse,
} from '../_types/settlement';

export const getMySettlementAccount = async (): Promise<SettlementAccountResponse> => {
  const response = await api.get<SettlementAccountResponse>('/api/settlement-account');
  return response.data;
};

export const upsertSettlementAccount = async (
  data: UpsertSettlementAccountRequest,
): Promise<SettlementAccountResponse> => {
  const response = await api.put<SettlementAccountResponse>('/api/settlement-account', data);
  return response.data;
};

export const deleteSettlementAccount = async (): Promise<void> => {
  await api.delete('/api/settlement-account');
};

export const verifySettlementAccount = async (): Promise<VerifySettlementAccountResponse> => {
  const response = await api.post<VerifySettlementAccountResponse>('/api/settlement-account/verify');
  return response.data;
};
