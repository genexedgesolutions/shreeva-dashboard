// pages/admin/products/[pid]/edit.js
import { useRouter } from 'next/router';
import useSWR from 'swr';
import api from '../../../../lib/api';
import Layout from '../../../../components/Layout';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';

const fetchProduct = async (pid) => {
  // try by id first
  try {
    const res = await api.get(`/products/${pid}`, { params: { _t: Date.now() } });
    // normalize
    return res?.product ?? res;
  } catch (err) {
    // if id lookup fails, try slug
    const res2 = await api.get(`/products/slug/${pid}`, { params: { _t: Date.now() } });
    return res2?.product ?? res2;
  }
};

export default function EditProduct() {
  const router = useRouter();
  const { pid } = router.query;

  const { data, error, mutate } = useSWR(pid ? ['product', pid] : null, () => fetchProduct(pid));

  const [form, setForm] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [saving, setSaving] = useState(false);
  const [variantsJson, setVariantsJson] = useState('');

  useEffect(() => {
    if (!data) return;
    // data might be product object or wrapper
    const prod = data?.product ?? data;
    setForm({
      title: prod.title ?? prod.post_title ?? prod.name ?? '',
      slug: prod.slug ?? prod.post_name ?? '',
      sku: prod.sku ?? '',
      shortDescription: prod.shortDescription ?? '',
      description: prod.description ?? prod.post_content ?? '',
      category: prod.category ?? '',
      brand: prod.brand ?? '',
      basePrice: prod.basePrice ?? prod.price ?? prod.regular_price ?? '',
      salePrice: prod.salePrice ?? prod.sale_price ?? '',
      productType: prod.productType ?? 'single',
      isPublished: typeof prod.isPublished === 'boolean' ? prod.isPublished : prod.post_status === 'publish',
      isMadeToOrder: prod.isMadeToOrder ?? false,
      leadTimeDays: prod.leadTimeDays ?? 7,
      allowResizing: prod.allowResizing ?? true,
      allowEngraving: prod.allowEngraving ?? false,
      makingCharges: prod.makingCharges ?? 0,
      stockQuantity: prod.stockQuantity ?? prod.stockQuantity ?? 0,
      manageStock: prod.manageStock ?? true,
      weightGrams: prod.weightGrams ?? '',
      metaTitle: prod.metaTitle ?? '',
      metaDescription: prod.metaDescription ?? '',
      featured: !!prod.featured,
      returnable: !!prod.returnable,
      warranty: prod.warranty ?? '',
      images_existing: prod.images ?? [],
      variants: prod.variants ?? [],
      _id: prod._id ?? prod.id,
    });

    if (prod.variants) setVariantsJson(JSON.stringify(prod.variants, null, 2));
  }, [data]);

  useEffect(() => {
    // generate previews for selected files
    if (!newImages || newImages.length === 0) {
      setPreviews([]);
      return;
    }
    const urls = newImages.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [newImages]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleImageSelect(e) {
    setNewImages(Array.from(e.target.files || []));
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form?.title) {
      toast.error('Title required');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      if (form.slug) fd.append('slug', form.slug);
      fd.append('sku', form.sku);
      fd.append('shortDescription', form.shortDescription);
      fd.append('description', form.description);
      fd.append('category', form.category);
      fd.append('brand', form.brand);
      fd.append('basePrice', String(form.basePrice || '0'));
      if (form.salePrice) fd.append('salePrice', String(form.salePrice));
      fd.append('productType', form.productType);
      fd.append('isPublished', form.isPublished ? 'true' : 'false');
      fd.append('isMadeToOrder', form.isMadeToOrder ? 'true' : 'false');
      fd.append('leadTimeDays', String(form.leadTimeDays || 0));
      fd.append('allowResizing', form.allowResizing ? 'true' : 'false');
      fd.append('allowEngraving', form.allowEngraving ? 'true' : 'false');
      fd.append('makingCharges', String(form.makingCharges || 0));
      fd.append('stockQuantity', String(form.stockQuantity || 0));
      fd.append('manageStock', form.manageStock ? 'true' : 'false');
      if (form.weightGrams) fd.append('weightGrams', String(form.weightGrams));
      fd.append('metaTitle', form.metaTitle || '');
      fd.append('metaDescription', form.metaDescription || '');
      fd.append('featured', form.featured ? 'true' : 'false');
      fd.append('returnable', form.returnable ? 'true' : 'false');
      fd.append('warranty', form.warranty || '');
      if (variantsJson) fd.append('variants', variantsJson);

      newImages.forEach((f) => fd.append('images', f)); // matches upload.array("images")

      const res = await api.put(`/products/${form._id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const body = res?.data ?? res;
      if (body?.success || res?.success) {
        toast.success('Product updated');
        mutate();
        setTimeout(() => router.push('/admin/products'), 300);
      } else {
        toast.error(body?.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || err.message || 'Error');
    } finally {
      setSaving(false);
    }
  }

  if (error) {
    return (
      <Layout title="Edit Product">
        <div className="card">❌ Error loading product</div>
      </Layout>
    );
  }
  if (!form) {
    return (
      <Layout title="Edit Product">
        <div className="card">⏳ Loading…</div>
      </Layout>
    );
  }

  return (
    <Layout title={`Edit Product: ${form.title}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2>Edit Product</h2>
        <Link href="/admin/products" legacyBehavior>
          <a className="btn ghost">Back</a>
        </Link>
      </div>

      <form onSubmit={handleSave}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
            {/* Left */}
            <div>
              <div className="form-row"><label>Title</label><input name="title" value={form.title} onChange={handleChange} /></div>
              <div className="form-row"><label>Slug</label><input name="slug" value={form.slug} onChange={handleChange} /></div>
              <div className="form-row"><label>SKU</label><input name="sku" value={form.sku} onChange={handleChange} /></div>
              <div className="form-row"><label>Short description</label><input name="shortDescription" value={form.shortDescription} onChange={handleChange} /></div>
              <div className="form-row"><label>Description</label><textarea name="description" value={form.description} onChange={handleChange} rows={6} /></div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div className="form-row"><label>Base price</label><input type="number" name="basePrice" value={form.basePrice} onChange={handleChange} /></div>
                <div className="form-row"><label>Sale price</label><input type="number" name="salePrice" value={form.salePrice} onChange={handleChange} /></div>
              </div>

              <div className="form-row">
                <label>Product type</label>
                <select name="productType" value={form.productType} onChange={handleChange}>
                  <option value="single">Single</option>
                  <option value="variant">Variant</option>
                  <option value="made-to-order">Made To Order</option>
                </select>
              </div>

              <div className="form-row">
                <label>Variants JSON (optional)</label>
                <textarea value={variantsJson} onChange={(e) => setVariantsJson(e.target.value)} rows={4} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div className="form-row"><label>Stock quantity</label><input type="number" name="stockQuantity" value={form.stockQuantity} onChange={handleChange} /></div>
                <div className="form-row"><label>Manage stock</label>
                  <select name="manageStock" value={String(form.manageStock)} onChange={(e) => setForm(p => ({...p, manageStock: e.target.value === 'true'}))}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>

              <div className="form-row"><label>Category (ID)</label><input name="category" value={form.category} onChange={handleChange} /></div>

              <div style={{ marginTop: 12 }}>
                <button className="btn" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
                <button type="button" className="btn ghost" style={{ marginLeft: 8 }} onClick={() => mutate()}>Refresh</button>
              </div>
            </div>

            {/* Right */}
            <aside>
              <div className="card" style={{ marginBottom: 12 }}>
                <strong>Images</strong>
                <input type="file" accept="image/*" multiple onChange={handleImageSelect} style={{ marginTop: 8 }} />
                {previews.length > 0 ? (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                    {previews.map((u, i) => <img key={i} src={u} style={{ height: 80, borderRadius: 6 }} />)}
                  </div>
                ) : form.images_existing?.length ? (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                    {form.images_existing.map((u, i) => <img key={i} src={u} style={{ height: 80, borderRadius: 6 }} />)}
                  </div>
                ) : null}
              </div>

              <div className="card">
                <strong>Summary</strong>
                <div className="kv" style={{ marginTop: 8 }}>
                  <div><strong>Price:</strong> ₹{form.basePrice} {form.salePrice ? `(sale ₹${form.salePrice})` : ''}</div>
                  <div style={{ marginTop: 6 }}><strong>Stock:</strong> {form.stockQuantity}</div>
                  <div style={{ marginTop: 6 }}><strong>Type:</strong> {form.productType}</div>
                  <div style={{ marginTop: 6 }}><strong>Published:</strong> {form.isPublished ? 'Yes' : 'No'}</div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </form>
    </Layout>
  );
}
