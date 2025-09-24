// pages/admin/categories/[id]/view.js
import { useRouter } from 'next/router';
import useSWR from 'swr';
import api from '../../../../lib/api';
import Layout from '../../../../components/Layout';

const fetcher = (url) => api.get(url, { params: { _t: Date.now() } });

export default function CategoryView() {
  const router = useRouter();
  const { id } = router.query;

  const { data, error } = useSWR(id ? `/products/category/${id}` : null, fetcher);

  if (error) {
    return (
      <Layout title="Category">
        <div className="card">❌ Error loading category</div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout title="Category">
        <div className="card">⏳ Loading…</div>
      </Layout>
    );
  }

  // normalize response shapes: res may be { data: category } or category directly
  const cat = data?.data ?? data?.category ?? data;

  return (
    <Layout title={`Category: ${cat?.name ?? id}`}>
      <div className="card">
        <h2>{cat?.name}</h2>
        {cat?.thumbnail && <img src={cat.thumbnail} alt={cat.name} style={{height:120, borderRadius:8}} />}
        <p className="kv" style={{marginTop:8}}>{cat?.description ?? '—'}</p>

        <div style={{marginTop:12}}>
          <strong>Slug:</strong> {cat?.slug ?? '—'}
        </div>
        <div style={{marginTop:6}}>
          <strong>Active:</strong> {String(cat?.isActive ?? true)}
        </div>

        {Array.isArray(cat?.images) && cat.images.length > 0 && (
          <div style={{display:'flex', gap:8, marginTop:12, flexWrap:'wrap'}}>
            {cat.images.map((u,i) => <img key={i} src={u} alt={`img-${i}`} style={{height:72,borderRadius:6}}/>)}
          </div>
        )}
      </div>
    </Layout>
  );
}
