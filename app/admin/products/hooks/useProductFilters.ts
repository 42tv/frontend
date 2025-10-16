import { useState, useMemo } from 'react';
import { Product } from '@/app/_apis/admin';
import { StatusFilter } from '../types';

export function useProductFilters(products: Product[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filteredProducts = useMemo(() => {
    return (products || []).filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'all' ||
                           (statusFilter === 'active' && product.is_active) ||
                           (statusFilter === 'inactive' && !product.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [products, searchTerm, statusFilter]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredProducts,
  };
}
