import { useState, useMemo, type ReactNode } from 'react';
import { HiChevronUp, HiChevronDown, HiSearch, HiPencil, HiTrash, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { cn } from '@utils/cn';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  pageSize?: number;
  loading?: boolean;
  emptyMessage?: string;
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onEdit,
  onDelete,
  searchable = true,
  searchKeys,
  pageSize = 10,
  loading,
  emptyMessage = 'No items found.',
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!search || !searchKeys) return data;
    const q = search.toLowerCase();
    return data.filter((item) =>
      searchKeys.some((key) => {
        const val = item[key];
        return val != null && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, search, searchKeys]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];
      if (aVal == null || bVal == null) return 0;
      const cmp = typeof aVal === 'number' && typeof bVal === 'number'
        ? aVal - bVal
        : String(aVal).localeCompare(String(bVal));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      {searchable && searchKeys && (
        <div className="relative mb-4">
          <HiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-luxury-gray" size={16} />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full max-w-xs rounded-xl border border-glass-light bg-luxury-charcoal/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-luxury-gray outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-glass-light">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-glass-light bg-luxury-charcoal/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 font-medium text-luxury-gray',
                    col.sortable && 'cursor-pointer select-none hover:text-white',
                    col.className
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && sortKey === col.key && (
                      sortDir === 'asc' ? <HiChevronUp size={14} /> : <HiChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && <th className="px-4 py-3 font-medium text-luxury-gray">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-4 py-12 text-center text-luxury-gray">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginated.map((item) => (
                <tr key={keyExtractor(item)} className="border-b border-glass-light/50 transition-all hover:bg-glass-light/20">
                  {columns.map((col) => (
                    <td key={col.key} className={cn('px-4 py-3 text-white', col.className)}>
                      {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-luxury-gray transition-all hover:bg-gold-500/10 hover:text-gold-500"
                            title="Edit"
                          >
                            <HiPencil size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-luxury-gray transition-all hover:bg-red-500/10 hover:text-red-500"
                            title="Delete"
                          >
                            <HiTrash size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-luxury-gray">
            Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, sorted.length)} of {sorted.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-luxury-gray transition-all hover:bg-glass-light hover:text-white disabled:opacity-30"
            >
              <HiChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-all',
                  i === page ? 'bg-gold-500 text-luxury-black' : 'text-luxury-gray hover:bg-glass-light hover:text-white'
                )}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-luxury-gray transition-all hover:bg-glass-light hover:text-white disabled:opacity-30"
            >
              <HiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
