import { useState, useEffect, useCallback } from 'react';
import { HiPlus } from 'react-icons/hi';
import api from '@services/api';
import DataTable, { type Column } from '@components/admin/DataTable';
import ConfirmDialog from '@components/admin/ConfirmDialog';
import ProductForm from './forms/ProductForm';
import type { Product } from '@/types';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetch = useCallback(() => {
    setLoading(true);
    api.get('/products')
      .then((res) => setProducts(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/products/${deleteTarget._id}`);
      setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) { console.error(err); }
    finally { setDeleting(false); }
  };

  const columns: Column<Product>[] = [
    { key: 'name', header: 'Name', sortable: true, render: (p) => (
      <div className="flex items-center gap-3">
        {p.images?.[0] && <img src={p.images[0]} alt="" className="h-10 w-10 rounded-lg object-cover" />}
        <div>
          <span className="font-medium">{p.name}</span>
          {p.featured && <span className="ml-2 rounded bg-gold-500/20 px-2 py-0.5 text-xs text-gold-500">Featured</span>}
        </div>
      </div>
    )},
    { key: 'category', header: 'Category', sortable: true },
    { key: 'price', header: 'Price', sortable: true, render: (p) => (
      <span>{p.salePrice ? <><span>${p.salePrice}</span> <span className="ml-1 text-red-400 line-through">${p.price}</span></> : `$${p.price}`}</span>
    )},
    { key: 'stock', header: 'Stock', sortable: true, render: (p) => (
      <span className={p.stock > 0 ? 'text-green-500' : 'text-red-500'}>{p.stock}</span>
    )},
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="mt-1 text-sm text-luxury-gray">Manage shop products.</p>
        </div>
        <button onClick={() => { setEditing(null); setFormOpen(true); }}
          className="flex items-center gap-2 rounded-xl bg-gold-500 px-5 py-2.5 text-sm font-bold text-luxury-black transition-all hover:bg-gold-400">
          <HiPlus size={18} /> New Product
        </button>
      </div>
      <DataTable columns={columns} data={products} keyExtractor={(p) => p._id}
        onEdit={(p) => { setEditing(p); setFormOpen(true); }}
        onDelete={(p) => setDeleteTarget(p)}
        searchable searchKeys={['name', 'category']} loading={loading} emptyMessage="No products yet." />
      {formOpen && (
        <ProductForm product={editing} onClose={() => { setFormOpen(false); setEditing(null); }}
          onSaved={() => { fetch(); setFormOpen(false); setEditing(null); }} />
      )}
      <ConfirmDialog open={!!deleteTarget} title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
}
