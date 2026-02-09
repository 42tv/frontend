import type { Product } from "../../_types/product";

interface SelectedProductSummaryProps {
  selectedProduct: Product | null;
}

export default function SelectedProductSummary({
  selectedProduct,
}: SelectedProductSummaryProps) {
  if (!selectedProduct) return null;

  return (
    <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
        선택된 상품
      </h3>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-900 dark:text-white">{selectedProduct.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            기본 {selectedProduct.base_coins}코인
            {selectedProduct.bonus_coins > 0 &&
              ` + 보너스 ${selectedProduct.bonus_coins}코인`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {selectedProduct.price.toLocaleString()}원
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">(VAT 포함)</p>
        </div>
      </div>
    </div>
  );
}
