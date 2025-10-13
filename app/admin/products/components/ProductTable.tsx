import Image from 'next/image';
import { Product } from '@/app/_apis/admin';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number, currentStatus: boolean) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  onToggleStatus,
}: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="text-center py-12">
          <p className="text-muted-foreground">검색 조건에 맞는 상품이 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                상품 정보
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                기본 코인
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                보너스 코인
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                총 코인
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                가격
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                액션
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-muted-foreground text-xs text-center">
                          이미지<br />없음
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-foreground">{product.name}</div>
                      {product.description && (
                        <div className="text-sm text-muted-foreground">{product.description}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {product.base_coins.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {product.bonus_coins.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-foreground">
                  {product.total_coins.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {product.price.toLocaleString()}원
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.is_active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {product.is_active ? '활성' : '비활성'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => onToggleStatus(product.id, product.is_active)}
                      className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 text-sm font-medium"
                    >
                      {product.is_active ? '비활성화' : '활성화'}
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
