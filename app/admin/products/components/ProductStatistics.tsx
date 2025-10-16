import { Product } from '@/app/_apis/admin';

interface ProductStatisticsProps {
  products: Product[];
}

export default function ProductStatistics({ products }: ProductStatisticsProps) {
  const activeCount = products.filter(p => p.is_active).length;
  const inactiveCount = products.filter(p => !p.is_active).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">총 상품 수</h3>
          <p className="text-3xl font-bold text-foreground">{products.length}</p>
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">활성 상품</h3>
          <p className="text-3xl font-bold text-green-600">{activeCount}</p>
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">비활성 상품</h3>
          <p className="text-3xl font-bold text-red-600">{inactiveCount}</p>
        </div>
      </div>
    </div>
  );
}
