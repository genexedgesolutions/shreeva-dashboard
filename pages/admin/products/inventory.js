// pages/admin/products/index.js
import useSWR from 'swr';
import api from '../../../lib/api';
import Layout from '../../../components/Layout';
import AppDataTable from '../../../components/DataTable';
import { useMemo } from 'react';
import { toast } from 'react-toastify';
import { FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import Link from 'next/link';

// Custom fetcher to fetch all pages until total reached
const fetchAllProducts = async () => {
  let page = 1;
  let allProducts = [];
  let total = 0;
  let limit = 20;

  while (true) {
    const res = await api.get('/products', { params: { page, limit, _t: Date.now() } });

    const products = res?.products || res?.data || [];
    total = res?.total || total;
    limit = res?.limit || limit;

    allProducts = [...allProducts, ...products];

    if (allProducts.length >= total) break;
    page++;
  }

  return { products: allProducts, total };
};

export default function ProductsPage() {
  const { data, error, isValidating, mutate } = useSWR('all-products', fetchAllProducts, {
    revalidateOnFocus: true,
  });

  const products = data?.products || [];

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete product: ${title}?`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      mutate();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const columns = useMemo(
    () => [
      {
        id: 'image',
        name: 'Image',
        cell: (row) =>
          row.images?.[0] ? (
            <img
              src={row.images[0]}
              alt={row.post_title}
              style={{ height: 40, borderRadius: 4 }}
            />
          ) : (
            '—'
          ),
        width: '90px',
      },
      {
        id: 'title',
        name: 'Title',
        selector: (row) => row.post_title || row.name,
        sortable: true,
        wrap: true,
      },
      {
        id: 'sku',
        name: 'SKU',
        selector: (row) =>
          row.sku ||
          (row.post_content?.includes('SKU') ? 'See details' : '—'),
      },
      {
        id: 'price',
        name: 'Price',
        selector: (row) =>
          row.price?.sell
            ? `₹${row.price.sell}`
            : row.meta_total_sales
            ? `Sold: ${row.meta_total_sales}`
            : '—',
      },
      {
        id: 'stock',
        name: 'Stock',
        selector: (row) =>
          row.manageStock
            ? `${row.stockQuantity} (${row.stock_status})`
            : row.stock_status || '—',
      },
      {
        id: 'status',
        name: 'Status',
        selector: (row) => row.post_status,
        sortable: true,
      },
      {
        id: 'created',
        name: 'Created At',
        selector: (row) =>
          row.createdAt ? new Date(row.createdAt).toLocaleString() : '-',
        sortable: true,
      },
      {
        id: 'actions',
        name: 'Actions',
        cell: (row) => (
          <div style={{ display: 'flex', gap: 6 }}>
            {/* View */}
            <Link href={`/admin/products/${row._id}`} legacyBehavior>
              <a
                className="btn ghost"
                style={{
                  padding: '4px 8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <FiEye />
              </a>
            </Link>

            {/* Edit */}
            <Link href={`/admin/products/${row._id}/edit`} legacyBehavior>
              <a
                className="btn"
                style={{
                  padding: '4px 8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <FiEdit />
              </a>
            </Link>

            {/* Delete */}
            <button
              className="btn"
              style={{
                background: '#ef4444',
                color: 'white',
                padding: '4px 8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
              onClick={() =>
                handleDelete(row._id, row.post_title || row.name)
              }
            >
              <FiTrash2 />
            </button>
          </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
    ],
    [mutate]
  );

  if (error) {
    return (
      <Layout title="Products">
        <div className="card">❌ Error loading products</div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout title="Products">
        <div className="card">⏳ Loading all products...</div>
      </Layout>
    );
  }

  return (
    <Layout title="Products">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <h2>Products</h2>
        <Link href="/admin/products/new" legacyBehavior>
          <a className="btn">+ Add Product</a>
        </Link>
      </div>

      <div className="card">
        {isValidating && (
          <div style={{ marginBottom: 8 }}>🔄 Refreshing…</div>
        )}
        <AppDataTable
          title={`Products (${products.length})`}
          columns={columns}
          data={products}
          selectable={true}
          defaultSortFieldId="title"
        />
      </div>
    </Layout>
  );
}
