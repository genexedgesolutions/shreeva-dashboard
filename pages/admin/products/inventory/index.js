// pages/admin/products/index.js
import useSWR from 'swr';
import api from '../../../../lib/api';
import Layout from '../../../../components/Layout';
import AppDataTable from '../../../../components/DataTable';
import { useMemo } from 'react';
import { toast } from 'react-toastify';
import { FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import Link from 'next/link';

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

  // stock update handler
  const handleStockChange = async (id, value) => {
    try {
      await api.post(`/products/inventory`, {
        productId: id,
        stockQuantity: Number(value),
      });
      toast.success('Stock updated');
      mutate(); // revalidate list
    } catch (err) {
      toast.error('Failed to update stock');
    }
  };

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
      {
        id: 'stock',
        name: 'Stock',
        cell: (row) => (
          <input
            type="number"
            min="0"
            defaultValue={row.stockQuantity}
            style={{ width: "80px", padding: "4px" }}
            onBlur={(e) => handleStockChange(row._id, e.target.value)} // blur par update
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.target.blur(); // Enter press → blur → update
              }
            }}
          />
        ),
      },
    ],
    []
  );

  if (error) {
    return (
      <Layout title="Products Inventory">
        <div className="card">❌ Error loading products</div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout title="Products Inventory">
        <div className="card">⏳ Loading all products...</div>
      </Layout>
    );
  }

  return (
    <Layout title="Products Inventory">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        
       
      </div>

      <div className="card">
        {isValidating && <div style={{ marginBottom: 8 }}>🔄 Refreshing…</div>}
        <AppDataTable
       
          columns={columns}
          data={products}
          selectable={true}
          defaultSortFieldId="title"
        />
      </div>
    </Layout>
  );
}
