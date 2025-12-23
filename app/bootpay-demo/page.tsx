"use client";

import { useState } from "react";

declare global {
  interface Window {
    BootPay: {
      request: (config: any) => {
        error: (fn: (data: any) => void) => {
          cancel: (fn: (data: any) => void) => {
            ready: (fn: (data: any) => void) => {
              confirm: (fn: (data: any) => void) => {
                done: (fn: (data: any) => void) => void;
              };
            };
          };
        };
      };
    };
  }
}

export default function BootpayDemoPage() {
  const [receiptId, setReceiptId] = useState<string>("");
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [statusResult, setStatusResult] = useState<any>(null);

  const handlePayment = () => {
    if (typeof window === "undefined" || !window.BootPay) {
      alert("Bootpay 스크립트가 로드되지 않았습니다.");
      return;
    }

    const uniqueOrderId = `order_${Date.now()}`;

    window.BootPay.request({
      price: 1000,
      application_id: "5b8f6a4d396fa665fdc2b5e7", // Sandbox test ID
      name: "테스트 상품",
      pg: "kcp",
      method: "card",
      order_id: uniqueOrderId,
      params: { userName: "테스트유저" },
      account_expire_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      extra: {
        open_type: "iframe",
        card_quota: "0,2,3",
      },
    })
      .error(function (data: any) {
        console.error("결제 오류:", data);
        setPaymentResult({ type: "error", data });
        alert("결제 오류가 발생했습니다: " + (data.message || JSON.stringify(data)));
      })
      .cancel(function (data: any) {
        console.log("결제 취소:", data);
        setPaymentResult({ type: "cancel", data });
        alert("결제가 취소되었습니다.");
      })
      .ready(function (data: any) {
        console.log("가상계좌 발급:", data);
        setPaymentResult({ type: "ready", data });
      })
      .confirm(function (data: any) {
        console.log("결제 승인 전:", data);
        return true; // 결제 승인
      })
      .done(function (data: any) {
        console.log("결제 완료:", data);
        setPaymentResult({ type: "done", data });
        setReceiptId(data.receipt_id);
        alert(`결제가 완료되었습니다!\nReceipt ID: ${data.receipt_id}`);
      });
  };

  const handleVerifyPayment = async () => {
    if (!receiptId) {
      alert("결제 후 Receipt ID를 먼저 받아주세요.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/bootpay/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ receiptId }),
      });

      const result = await response.json();
      setVerificationResult(result);
      alert(
        result.success
          ? "결제 검증 성공!"
          : `결제 검증 실패: ${result.error}`
      );
    } catch (error: any) {
      console.error("검증 요청 오류:", error);
      alert("검증 요청 중 오류가 발생했습니다.");
    }
  };

  const handleCancelPayment = async () => {
    if (!receiptId) {
      alert("취소할 결제의 Receipt ID를 먼저 입력해주세요.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/bootpay/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiptId,
          cancelUsername: "Admin",
          cancelMessage: "테스트 취소",
        }),
      });

      const result = await response.json();
      alert(
        result.success
          ? "결제 취소 성공!"
          : `결제 취소 실패: ${result.error}`
      );
    } catch (error: any) {
      console.error("취소 요청 오류:", error);
      alert("취소 요청 중 오류가 발생했습니다.");
    }
  };

  const handleCheckStatus = async () => {
    if (!receiptId) {
      alert("상태를 확인할 Receipt ID를 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/bootpay/status/${receiptId}`
      );
      const result = await response.json();
      setStatusResult(result);
      alert(
        result.success
          ? `결제 상태: ${result.status}`
          : `상태 확인 실패: ${result.error}`
      );
    } catch (error: any) {
      console.error("상태 확인 오류:", error);
      alert("상태 확인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Bootpay Sandbox Demo
          </h1>

          {/* Payment Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              1. 결제 테스트
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Sandbox 환경에서 테스트 결제를 진행합니다. (1,000원)
            </p>
            <button
              onClick={handlePayment}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              결제하기
            </button>
          </div>

          {/* Receipt ID Input */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              2. Receipt ID
            </h2>
            <input
              type="text"
              value={receiptId}
              onChange={(e) => setReceiptId(e.target.value)}
              placeholder="결제 후 자동으로 입력되거나 직접 입력하세요"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleVerifyPayment}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              결제 검증
            </button>
            <button
              onClick={handleCheckStatus}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              상태 확인
            </button>
            <button
              onClick={handleCancelPayment}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              결제 취소
            </button>
          </div>

          {/* Results Display */}
          {paymentResult && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                결제 결과:
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-auto text-sm text-gray-800 dark:text-gray-200">
                {JSON.stringify(paymentResult, null, 2)}
              </pre>
            </div>
          )}

          {verificationResult && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                검증 결과:
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-auto text-sm text-gray-800 dark:text-gray-200">
                {JSON.stringify(verificationResult, null, 2)}
              </pre>
            </div>
          )}

          {statusResult && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                상태 확인 결과:
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-auto text-sm text-gray-800 dark:text-gray-200">
                {JSON.stringify(statusResult, null, 2)}
              </pre>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
              사용 방법:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800 dark:text-blue-300">
              <li>결제하기 버튼을 클릭하여 테스트 결제를 시작합니다</li>
              <li>테스트 카드 정보를 입력합니다 (샌드박스 환경)</li>
              <li>결제 완료 후 Receipt ID가 자동으로 입력됩니다</li>
              <li>결제 검증 버튼으로 서버에서 결제를 검증합니다</li>
              <li>상태 확인 버튼으로 현재 결제 상태를 조회합니다</li>
              <li>결제 취소 버튼으로 결제를 취소할 수 있습니다</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
