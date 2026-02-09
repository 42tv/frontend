"use client";

import { useProducts } from "./hooks/useProducts";
import { useBootpayPayment } from "./hooks/useBootpayPayment";
import { useBootpayStyles } from "./hooks/useBootpayStyles";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import ProductGrid from "./components/ProductGrid";
import SelectedProductSummary from "./components/SelectedProductSummary";
import PaymentButton from "./components/PaymentButton";

export default function BootpayDemoPage() {
  const { products, selectedProduct, setSelectedProduct, isLoading, error } =
    useProducts();
  const { handlePayment } = useBootpayPayment();
  useBootpayStyles();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            코인 충전
          </h1>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              상품 선택
            </h2>
            <ProductGrid
              products={products}
              selectedProduct={selectedProduct}
              onSelectProduct={setSelectedProduct}
            />
          </div>

          <SelectedProductSummary selectedProduct={selectedProduct} />

          <div className="mb-8">
            <PaymentButton
              selectedProduct={selectedProduct}
              onPayment={() => selectedProduct && handlePayment(selectedProduct)}
              disabled={!selectedProduct}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
