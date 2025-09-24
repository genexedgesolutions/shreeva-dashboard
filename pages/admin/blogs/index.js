import useSWR from 'swr';
import api from '../../../lib/api';
import Layout from '../../../components/Layout';
import AppDataTable from '../../../components/DataTable';
import { useMemo } from 'react';
import { toast } from 'react-toastify';
import { FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import Link from 'next/link';

const fetcher = (url) => api.get(url, { params: { _t: Date.now() } });

export default function BlogsPage() {
  const { data, error, isValidating, mutate } = useSWR('/blogs/get-all-blogs', fetcher, {
    revalidateOnFocus: true,
  });

  const blogs = data || [];

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete blog: ${title}?`)) return;
    try {
      await api.delete(`/blogs/delete/${id}`);
      toast.success('Blog deleted');
      mutate();
    } catch (err) {
      toast.error('Failed to delete blog');
    }
  };

  const columns = useMemo(
    () => [
      {
        id: 'image',
        name: 'Image',
        cell: (row) =>
          row.image?.[0] ? (
            <img src={row.image[0]} alt={row.title} style={{ height: 40, borderRadius: 4 }} />
          ) : (
            '—'
          ),
        width: '90px',
      },
      {
        id: 'title',
        name: 'Title',
        selector: (row) => row.title,
        sortable: true,
      },
      {
        id: 'category',
        name: 'Category',
        selector: (row) => row.category,
        sortable: true,
      },
      {
        id: 'author',
        name: 'Author',
        selector: (row) => row.author || '—',
      },
      {
        id: 'created',
        name: 'Created At',
        selector: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleString() : '-'),
        sortable: true,
      },
      {
        id: 'actions',
        name: 'Actions',
        cell: (row) => (
          <div style={{ display: 'flex', gap: 6 }}>
            {/* View */}
            <Link href={`/admin/blogs/${row.slug}/view`} legacyBehavior>
              <a className="btn ghost" style={{ padding: '4px 8px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <FiEye />
              </a>
            </Link>
            {/* Edit */}
            <Link href={`/admin/blogs/${row.slug}/edit`} legacyBehavior>
              <a className="btn" style={{ padding: '4px 8px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <FiEdit />
              </a>
            </Link>
            {/* Delete */}
            <button
              className="btn"
              style={{ background: '#ef4444', color: 'white', padding: '4px 8px', display: 'inline-flex', alignItems: 'center', gap: 4 }}
              onClick={() => handleDelete(row._id, row.title)}
            >
              <FiTrash2 />
            </button>
          </div>
        ),
      },
    ],
    [mutate]
  );

  if (error) return <Layout title="Blogs"><div className="card">❌ Error loading blogs</div></Layout>;
  if (!data) return <Layout title="Blogs"><div className="card">⏳ Loading...</div></Layout>;

  return (
    <Layout title="Blogs">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2>Blogs</h2>
        <Link href="/admin/blogs/new" legacyBehavior>
          <a className="btn">+ Add Blog</a>
        </Link>
      </div>

      <div className="card">
        {isValidating && <div style={{ marginBottom: 8 }}>🔄 Refreshing…</div>}
        <AppDataTable title={`Blogs (${blogs.length})`} columns={columns} data={blogs} selectable={true} defaultSortFieldId="title" />
      </div>
    </Layout>
  );
}
