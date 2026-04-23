import { useEffect } from "react";

export const useBootpayStyles = () => {
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
};
