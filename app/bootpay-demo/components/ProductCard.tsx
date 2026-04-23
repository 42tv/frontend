import type { Product } from "../../_types/product";

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onClick: () => void;
}

export default function ProductCard({ product, isSelected, onClick }: ProductCardProps) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
        isSelected
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
  );
}
