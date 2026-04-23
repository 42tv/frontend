import { useCallback } from "react";
import { Bootpay } from "@bootpay/client-js";
import { preparePayment } from "../../_apis/product";
import type { Product } from "../../_types/product";

export const useBootpayPayment = () => {
  const handlePayment = useCallback(async (product: Product) => {
    if (!product) {
      alert("상품을 선택해주세요.");
      return;
    }

    try {
      console.log("결제 준비 요청 중...");
      const prepareResponse = await preparePayment(product.id, "bootpay");

      const prepareData = prepareResponse.data.data;

      if (!("pg_data" in prepareData) || !prepareData.pg_data || !(("price" in prepareData.product))) {
        throw new Error("결제 준비 데이터를 받지 못했습니다.");
      }

      const pgData = prepareData.pg_data;
      const productData = prepareData.product;
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
            id: productData.id.toString(),
            name: productData.name,
            qty: 1,
            price: productData.price,
          },
        ],
        extra: {
          open_type: "iframe",
          escrow: false,
          show_close_button: true,
          card_quota: "0,2,3",
          display_success_result: true,
          test_deposit: true,
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
  }, []);

  return {
    handlePayment,
  };
};
