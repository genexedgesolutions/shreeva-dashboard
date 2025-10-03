// pages/admin/products/index.js
import useSWR from 'swr';
import api from '../../../../lib/api';
import Layout from '../../../../components/Layout';
import AppDataTable from '../../../../components/DataTable';
import { useMemo, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { FiEye } from 'react-icons/fi';
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

// SWR fetcher
const fetcher = (url) => api.get(url).then(res => res);

export default function ProductsPage() {
  const { data, error, isValidating, mutate } = useSWR('all-products', fetchAllProducts, {
    revalidateOnFocus: true,
  });

  const products = data?.products || [];

  // --- Reviews Modal State ---
  const [openReviews, setOpenReviews] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openReviewsModal = useCallback((product) => {
    setSelectedProduct(product);
    setOpenReviews(true);
  }, []);

  const closeReviewsModal = useCallback(() => {
    setOpenReviews(false);
    setSelectedProduct(null);
  }, []);

  // Stock update (from your previous step)
  const handleStockChange = async (id, value) => {
    try {
      await api.post(`/products/inventory`, {
        productId: id,
        stockQuantity: Number(value),
      });
      toast.success('Stock updated');
      mutate();
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
          ) : ("—");
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
        id: 'reviews',
        name: 'Total Reviews',
        selector: (row) => row.reviews.length ?? 0,
      },
      {
        id: 'actions',
        name: 'Actions',
        cell: (row) => (
          <button
            className="btn bg-gradient"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            onClick={() => openReviewsModal(row)}
            title="View Reviews"
          >
            <FiEye /> Reviews
          </button>
        ),
        width: "140px",
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
    ],
    [openReviewsModal]
  );

  if (error) {
    return (
      <Layout title="Products Reviews">
        <div className="card">❌ Error loading products</div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout title="Products Reviews">
        <div className="card">⏳ Loading all products...</div>
      </Layout>
    );
  }

  return (
    <Layout title="Products Reviews">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        {/* <h2>{`Products Reviews (${products.length})`}</h2>
       */}
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

      {openReviews && (
        <ReviewsModal product={selectedProduct} onClose={closeReviewsModal} />
      )}
    </Layout>
  );
}

// ================= Reviews Modal =================

function ReviewsModal({ product, onClose }) {
  const productId = product?._id;
  const { data, error, isValidating } = useSWR(
    productId ? `/products/${productId}/reviews` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const reviews = data?.reviews || [];

  const reviewCols = useMemo(() => [
    {
      id: 'name',
      name: 'Name',
      selector: (row) => row.name || '—',
      sortable: true,
      wrap: true,
      width: '160px'
    },
    {
      id: 'rating',
      name: 'Rating',
      cell: (row) => (
        <span title={`${row.rating}/5`}>
          {'★'.repeat(Number(row.rating) || 0)}{'☆'.repeat(5 - (Number(row.rating) || 0))}
        </span>
      ),
      width: '140px'
    },
    {
      id: 'comment',
      name: 'Comment',
      selector: (row) => row.comment || '—',
      wrap: true,
      grow: 2,
    },
    {
      id: 'media',
      name: 'Media',
      cell: (row) => (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(row.images || []).map((src, idx) => (
            <img key={`img-${idx}`} src={src} alt="review" style={{ height: 500,width:100, borderRadius: 4 }} />
          ))}
          {(row.video || []).map((src, idx) => (
            <video key={`vid-${idx}`} src={src} controls style={{ height: 100,width:50, borderRadius: 4 }} />
          ))}
        </div>
      ),
      grow: 2,
    },
    {
      id: 'verified',
      name: 'Verified',
      cell: (row) => row.verifiedPurchase ? '✅' : '—',
      width: '100px'
    },
    {
      id: 'createdAt',
      name: 'Created At',
      selector: (row) =>
        row.createdAt ? new Date(row.createdAt).toLocaleString() : '—',
      sortable: true,
      width: '200px'
    },
  ], []);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: 16
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ maxWidth: 1100, width: '100%', maxHeight: '85vh', overflow: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <h3 style={{ margin: 0 }}>
            Reviews — {product?.post_title || product?.title || product?.name}
          </h3>
          <button className="btn bg-gradient" onClick={onClose}>Close</button>
        </div>

        {isValidating && <div style={{ marginTop: 8 }}>🔄 Loading reviews…</div>}
        {error && <div style={{ marginTop: 8, color: 'crimson' }}>❌ Failed to load reviews</div>}

        <div style={{ marginTop: 12 }}>
          <AppDataTable
            title={`Reviews (${reviews.length})`}
            columns={reviewCols}
            data={reviews}
            selectable={false}
            dense
          />
        </div>
      </div>
    </div>
  );
}
