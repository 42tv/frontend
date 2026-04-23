import type { Product } from "../../_types/product";

interface PaymentButtonProps {
  selectedProduct: Product | null;
  onPayment: () => void;
  disabled: boolean;
}

export default function PaymentButton({
  selectedProduct,
  onPayment,
  disabled,
}: PaymentButtonProps) {
  return (
    <button
      onClick={onPayment}
      disabled={disabled}
      className={`w-full ${
        disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      } text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg`}
    >
      {selectedProduct ? `${selectedProduct.price.toLocaleString()}원 결제하기` : "상품을 선택해주세요"}
    </button>
  );
}
