import { useState, useEffect } from "react";
import { getActiveProducts } from "../../_apis/product";
import type { Product } from "../../_types/product";

export const useProducts = () => {
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

  return {
    products,
    selectedProduct,
    setSelectedProduct,
    isLoading,
    error,
  };
};
