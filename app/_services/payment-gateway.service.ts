/**
 * Payment Gateway Service
 * - PG사별 결제 모듈 통합 서비스
 * - PG 모듈 추가 시 이 파일에 구현 추가
 */

export interface PaymentRequest {
  pg_provider: string;
  pg_transaction_id: string;
  amount: number;
  product_name: string;
  redirect_url?: string;
  app_scheme?: string;
  pg_data: Record<string, unknown>;
}

export interface PaymentResult {
  success: boolean;
  pg_transaction_id: string;
  message?: string;
  error?: string;
}

export class PaymentGatewayService {
  /**
   * PG사 결제 창 호출
   * - Mock: 즉시 성공 반환 (백엔드에서 이미 처리됨)
   * - Real PG: PG사 SDK를 통한 결제 창 호출
   */
  static async requestPayment(params: PaymentRequest): Promise<PaymentResult> {
    const { pg_provider, pg_transaction_id } = params;

    // Mock인 경우: 바로 성공 반환 (백엔드에서 이미 처리됨)
    if (pg_provider === 'mock') {
      return {
        success: true,
        pg_transaction_id,
        message: 'Mock 결제 완료',
      };
    }

    // Real PG인 경우: PG사 SDK 호출
    // TODO: PG 모듈 추가 시 여기에 구현
    switch (pg_provider) {
      case 'toss':
        return await this.requestTossPayment(params);

      case 'inicis':
        return await this.requestInicisPayment(params);

      case 'kakaopay':
        return await this.requestKakaopayPayment(params);

      default:
        throw new Error(`지원하지 않는 PG사: ${pg_provider}`);
    }
  }

  /**
   * 토스페이먼츠 결제 요청
   * TODO: @tosspayments/sdk 설치 후 구현
   */
  private static async requestTossPayment(
    _params: PaymentRequest,
  ): Promise<PaymentResult> {
    // TODO: 토스페이먼츠 SDK 구현
    // import { loadTossPayments } from '@tosspayments/sdk';
    // const tossPayments = await loadTossPayments(clientKey);
    // await tossPayments.requestPayment('카드', { ... });

    throw new Error('토스페이먼츠 SDK 미구현 - SDK 설치 후 구현 필요');
  }

  /**
   * 이니시스 결제 요청
   * TODO: 이니시스 SDK 설치 후 구현
   */
  private static async requestInicisPayment(
    _params: PaymentRequest,
  ): Promise<PaymentResult> {
    // TODO: 이니시스 SDK 구현

    throw new Error('이니시스 SDK 미구현 - SDK 설치 후 구현 필요');
  }

  /**
   * 카카오페이 결제 요청
   * TODO: 카카오페이 SDK 설치 후 구현
   */
  private static async requestKakaopayPayment(
    _params: PaymentRequest,
  ): Promise<PaymentResult> {
    // TODO: 카카오페이 SDK 구현

    throw new Error('카카오페이 SDK 미구현 - SDK 설치 후 구현 필요');
  }

  /**
   * 결제 결과 확인
   * - 결제 완료 후 서버에 결제 상태 조회
   */
  static async verifyPayment(pg_transaction_id: string): Promise<unknown> {
    // TODO: 백엔드 API 호출하여 결제 상태 확인
    // const response = await api.get(`/api/payments/pg/${pg_transaction_id}`);
    // return response.data;

    console.log('결제 확인:', pg_transaction_id);
    return null;
  }
}
