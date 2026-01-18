"use client";

import { useState, useEffect } from "react";
import { Bootpay } from "@bootpay/client-js";
import { getActiveProducts, preparePayment } from "../_apis/product";
import type { Product } from "../_types/product";

export default function BootpayDemoPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await getActiveProducts();
        setProducts(response.data);
        if (response.data.length > 0) {
          setSelectedProduct(response.data[0]);
        }
      } catch (err) {
        setError("상품 목록을 불러오는데 실패했습니다.");
        console.error("Failed to fetch products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.setAttribute("data-bootpay-size", "true");
    style.textContent = `
      body.bootpay-open .bootpay-payment-background > .bootpay-payment-window > #bootpay-iframe-id {
        width: min(90vw, 760px) !important;
        height: min(85vh, 900px) !important;
      }
      @media (max-width: 768px) {
        body.bootpay-open .bootpay-payment-background > .bootpay-payment-window > #bootpay-iframe-id {
          width: 100vw !important;
          height: 100vh !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, []);


  const handlePayment = async () => {
    if (!selectedProduct) {
      alert("상품을 선택해주세요.");
      return;
    }

    try {
      console.log("결제 준비 요청 중...");
      const prepareResponse = await preparePayment(selectedProduct.id, "bootpay");

      const prepareData = prepareResponse.data.data;

      if (!("pg_data" in prepareData) || !prepareData.pg_data || !("price" in prepareData.product)) {
        throw new Error("결제 준비 데이터를 받지 못했습니다.");
      }

      const pgData = prepareData.pg_data;
      const product = prepareData.product;
      console.log("결제 준비 완료:", prepareData);

      Bootpay.requestPayment({
        application_id: pgData.application_id,
        price: pgData.price,
        order_name: pgData.order_name,
        order_id: pgData.order_id,
        tax_free: 0,
        user: {
          id: pgData.user.id,
          username: pgData.user.username,
          phone: pgData.user.phone || "01088260761",
          email: pgData.user.email || "k1990121@gmail.com",
        },
        items: [
          {
            id: product.id.toString(),
            name: product.name,
            qty: 1,
            price: product.price,
          },
        ],
        extra: {
          open_type: "iframe",
          escrow: false,
          show_close_button: true,
          card_quota: "0,2,3",
          display_success_result: true,
        },
      })
        .then((response: unknown) => {
          console.log("결제/발급 완료:", response);
        })
        .catch((error: unknown) => {
          console.error("결제 처리 실패:", error);
          if (error instanceof Error && error.message) {
            alert(`결제가 취소되었습니다.\n${error.message}`);
          } else {
            alert("결제가 취소되었습니다.");
          }
        });
    } catch (error) {
      console.error("결제 처리 실패:", error);
      if (error instanceof Error) {
        alert(`결제가 취소되었습니다.\n${error.message}`);
      } else {
        alert("결제가 취소되었습니다.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-600 dark:text-gray-400">상품 목록을 불러오는 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
            <div className="flex justify-center items-center h-64">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                    selectedProduct?.id === product.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                  }`}
                >
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-32 object-contain mb-3 rounded"
                    />
                  )}
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {product.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {product.price.toLocaleString()}원
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {(product.base_coins + product.bonus_coins).toLocaleString()}코인
                    </span>
                  </div>
                  {product.bonus_coins > 0 && (
                    <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                      보너스: +{product.bonus_coins}코인
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {selectedProduct && (
            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                선택된 상품
              </h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-900 dark:text-white">
                    {selectedProduct.name}
                  </p>
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
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    (VAT 포함)
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-8">
            <button
              onClick={handlePayment}
              disabled={!selectedProduct}
              className={`w-full ${
                !selectedProduct
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg`}
            >
              {selectedProduct?.price.toLocaleString()}원 결제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
