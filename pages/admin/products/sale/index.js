// pages/admin/products/index.js
import useSWR from 'swr';
import api from '../../../../lib/api';
import Layout from '../../../../components/Layout';
import AppDataTable from '../../../../components/DataTable';
import { useMemo } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';

// fetch all pages until we have total products or no more pages
const fetchAllProducts = async () => {
  let page = 1;
  const limit = 20;
  let all = [];
  let total = null;
  const maxPages = 50;

  while (page <= maxPages) {
    const res = await api.get('/products', { params: { page, limit, _t: Date.now() } });
    const products = res?.products ?? res?.data ?? res?.items ?? [];
    const pageTotal = res?.total ?? res?.count ?? null;

    all = all.concat(products || []);

    if (total === null && pageTotal !== null) total = pageTotal;
    if (total !== null && all.length >= total) break;
    if (!products || (Array.isArray(products) && products.length < limit)) break;

    page += 1;
  }

  return { products: all, total: total ?? all.length };
};

export default function ProductsPage() {
  const { data, error, isValidating, mutate } = useSWR('all-products', fetchAllProducts, {
    revalidateOnFocus: true,
  });

  const products = data?.products || [];

  // ---- Helpers ----
  const toBool = (v) => v === true || v === 1 || v === '1';
  const toNum = (b) => (b ? 1 : 0);

  // POST to /products/sales with all 4 flags
  const postSalesFlags = async (row, nextField, nextValue) => {
    // Create payload with new value merged
    const payload = {
      productId: row._id,
      is_trending: toNum(nextField === 'is_trending' ? nextValue : toBool(row.is_trending)),
      is_exclusiveedition: toNum(nextField === 'is_exclusiveedition' ? nextValue : toBool(row.is_exclusiveedition)),
      is_bestseller: toNum(nextField === 'is_bestseller' ? nextValue : toBool(row.is_bestseller)),
      is_newlaunched: toNum(nextField === 'is_newlaunched' ? nextValue : toBool(row.is_newlaunched)),
    };

    await api.post('/products/sales', payload);
  };

  // Optimistic toggle handler
  const handleToggle = async (row, field, checked) => {
    const prev = products;

    // optimistic update: patch data in cache
    const nextProducts = products.map((p) =>
      p._id === row._id ? { ...p, [field]: toNum(checked) } : p
    );
    mutate({ products: nextProducts, total: data?.total }, false);

    try {
      await postSalesFlags(row, field, checked);
      toast.success('Updated');
      // revalidate from server
      mutate();
    } catch (e) {
      // revert on error
      mutate({ products: prev, total: data?.total }, false);
      toast.error('Update failed');
    }
  };

  // Small Toggle UI
  const Toggle = ({ checked, onChange }) => (
    <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ display: 'none' }}
      />
      <span
        style={{
          width: 40,
          height: 22,
          background: checked ? '#22c55e' : '#9ca3af',
          borderRadius: 999,
          position: 'relative',
          transition: 'background .15s ease',
          display: 'inline-block',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: checked ? 20 : 3,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left .15s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,.2)',
          }}
        />
      </span>
    </label>
  );

  const columns = useMemo(
    () => [
      {
        id: 'image',
        name: 'Image',
        cell: (row) => {
          let imgUrl = Array.isArray(row.images) ? row.images[0] : row.images;
          if (imgUrl) {
            imgUrl = imgUrl.split(" !")[0].trim();
          }
          return imgUrl ? (
            <img
              src={imgUrl}
              alt={row.post_title || row.title || row.name || "Product Image"}
              style={{ height: 40, borderRadius: 4 }}
            />
          ) : (
            "—"
          );
        },
        width: "90px",
      },
      {
        id: 'title',
        name: 'Title',
        selector: (row) => row.post_title || row.title || row.name,
        sortable: true,
        wrap: true,
      },

      // ---- Toggles ----
      {
        id: 'is_bestseller',
        name: 'Bestseller',
        cell: (row) => (
          <Toggle
            checked={toBool(row.is_bestseller)}
            onChange={(val) => handleToggle(row, 'is_bestseller', val)}
          />
        ),
        width: '140px',
      },
      {
        id: 'is_newlaunched',
        name: 'New Launched',
        cell: (row) => (
          <Toggle
            checked={toBool(row.is_newlaunched)}
            onChange={(val) => handleToggle(row, 'is_newlaunched', val)}
          />
        ),
        width: '160px',
      },
      {
        id: 'is_exclusiveedition',
        name: 'Exclusive Edition',
        cell: (row) => (
          <Toggle
            checked={toBool(row.is_exclusiveedition)}
            onChange={(val) => handleToggle(row, 'is_exclusiveedition', val)}
          />
        ),
        width: '170px',
      },
      {
        id: 'is_trending',
        name: 'Trending',
        cell: (row) => (
          <Toggle
            checked={toBool(row.is_trending)}
            onChange={(val) => handleToggle(row, 'is_trending', val)}
          />
        ),
        width: '130px',
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data] // re-build cell to reflect toggled values
  );

  if (error) {
    return (
      <Layout title="Products Sales">
        <div className="card">❌ Error loading products</div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout title="Products Sales">
        <div className="card">⏳ Loading all products...</div>
      </Layout>
    );
  }

  return (
    <Layout title="Products Sales">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2>Products Sales</h2>
        <Link href="/admin/products/new" legacyBehavior>
          <a className="btn">+ Add Product</a>
        </Link>
      </div>

      <div className="card">
        {isValidating && <div style={{ marginBottom: 8 }}>🔄 Refreshing…</div>}
        <AppDataTable
          title={`Products Sales (${products.length})`}
          columns={columns}
          data={products}
          selectable={true}
          defaultSortFieldId="title"
        />
      </div>
    </Layout>
  );
}
