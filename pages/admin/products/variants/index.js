// pages/admin/products/index.js
import useSWR from 'swr';
import api from '../../../../lib/api';
import Layout from '../../../../components/Layout';
import AppDataTable from '../../../../components/DataTable';
import { useMemo } from 'react';
import { toast } from 'react-toastify';
import { FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import Link from 'next/link';

// fetch all pages until we have total products or no more pages
const fetchAllProducts = async () => {
  let page = 1;
  const limit = 20;
  let all = [];
  let total = null;
  const maxPages = 50; // safety

  while (page <= maxPages) {
    const res = await api.get('/products', { params: { page, limit, _t: Date.now() } });
    // api returns body directly (thanks to interceptor). normalize:
    const products = res?.products ?? res?.data ?? res?.items ?? [];
    const pageTotal = res?.total ?? res?.count ?? null;

    all = all.concat(products || []);

    if (total === null && pageTotal !== null) total = pageTotal;

    // stop when we've loaded >= total (if total known)
    if (total !== null && all.length >= total) break;

    // If returned less than limit, end loop
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
  cell: (row) => {
    // row.images may be a string or array
    let imgUrl = Array.isArray(row.images) ? row.images[0] : row.images;

    if (imgUrl) {
      // remove extra " ! alt : ..." part
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
      {
        id: 'actions',
        name: 'Actions',
        cell: (row) => (
          <div style={{ display: 'flex', gap: 6 }}>
            <Link href={`/admin/products/variants/${row._id || row.id}`} legacyBehavior>
              <a className="btn ghost" style={{ padding: '4px 8px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <FiEye />
              </a>
            </Link>
          </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
      
    ],
    []
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
      <Layout title="">
        <div className="card">⏳ Loading all products...</div>
      </Layout>
    );
  }

  return (
    <Layout title="Products Variants">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        
      </div>

      <div className="card">
        {isValidating && <div style={{ marginBottom: 8 }}>🔄 Refreshing…</div>}
        <AppDataTable columns={columns} data={products} selectable={true} defaultSortFieldId="title" />
      </div>
    </Layout>
  );
}
