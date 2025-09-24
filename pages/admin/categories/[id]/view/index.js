// pages/admin/products/category/index.js
import useSWR from 'swr';
import api from '../../../lib/api';
import Layout from '../../../components/Layout';
import Link from 'next/link';
import { useMemo } from 'react';
import { FiEdit, FiTrash2, FiEye, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';

const fetcher = (url) => api.get(url, { params: { _t: Date.now() } });

export default function CategoriesIndex() {
  const { data, error, mutate, isValidating } = useSWR('/categories', fetcher, { revalidateOnFocus: true });

  if (error) return <Layout title="Categories"><div className="card">❌ Error loading categories</div></Layout>;
  if (!data) return <Layout title="Categories"><div className="card">⏳ Loading...</div></Layout>;

  // API returns array directly or inside data.data — handle both
  const cats = data?.data ?? data?.categories ?? data ?? [];

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      mutate();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <Layout title="Product Categories">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2>Categories</h2>
        <Link href="/admin/categories/new" legacyBehavior>
          <a className="btn"><FiPlus /> Add Category</a>
        </Link>
      </div>

      <div className="card">
        {isValidating && <div style={{ marginBottom: 8 }}>🔄 Refreshing…</div>}

        <table id='datable' className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Parent</th>
              <th>Active</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {cats.length === 0 && <tr><td colSpan="7">No categories</td></tr>}
            {cats.map((c) => (
              <tr key={c._id || c.id}>
                <td style={{ width: 90 }}>
                  {c.thumbnail ? <img src={c.thumbnail} alt={c.name} style={{ height: 40, borderRadius: 6 }} /> : (c.images?.[0] ? <img src={c.images[0]} alt={c.name} style={{ height: 40, borderRadius: 6 }} /> : '—')}
                </td>
                <td>{c.name}</td>
                <td>{c.slug || '—'}</td>
                <td>{c.parentName || c.parent || '—'}</td>
                <td>{c.isActive ? 'Yes' : 'No'}</td>
                <td>{c.createdAt ? new Date(c.createdAt).toLocaleString() : '-'}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Link href={`/admin/category/${c._id}/view`} legacyBehavior>
                      <a className="btn ghost" style={{ padding: '4px 8px' }}><FiEye /></a>
                    </Link>
                    <Link href={`/admin/categories/${c._id}/edit`} legacyBehavior>
                      <a className="btn" style={{ padding: '4px 8px' }}><FiEdit /></a>
                    </Link>
                    <button className="btn" style={{ background: '#ef4444', color: '#fff', padding: '4px 8px' }} onClick={() => handleDelete(c._id || c.id, c.name)}>
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
