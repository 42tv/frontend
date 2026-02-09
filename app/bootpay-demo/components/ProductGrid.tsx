import type { Product } from "../../_types/product";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  selectedProduct: Product | null;
  onSelectProduct: (product: Product) => void;
}

export default function ProductGrid({
  products,
  selectedProduct,
  onSelectProduct,
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isSelected={selectedProduct?.id === product.id}
          onClick={() => onSelectProduct(product)}
        />
      ))}
    </div>
  );
}
