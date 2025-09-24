// pages/admin/products/new.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import api from '../../../lib/api';
import { toast } from 'react-toastify';

export default function NewProduct() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    slug: '',
    sku: '',
    shortDescription: '',
    description: '',
    category: '',
    brand: '',
    basePrice: '',
    salePrice: '',
    productType: 'single',
    isPublished: true,
    isMadeToOrder: false,
    leadTimeDays: 7,
    allowResizing: true,
    allowEngraving: false,
    makingCharges: 0,
    stockQuantity: 0,
    manageStock: true,
    weightGrams: '',
    metaTitle: '',
    metaDescription: '',
    featured: false,
    returnable: false,
    warranty: '',
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [variantsJson, setVariantsJson] = useState(''); // optional: JSON for variants
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleImages(e) {
    const files = Array.from(e.target.files || []);
    setImages(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title?.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!form.basePrice || isNaN(Number(form.basePrice))) {
      toast.error('Base price is required (number)');
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      // model-aligned keys
      fd.append('title', form.title);
      if (form.slug) fd.append('slug', form.slug);
      fd.append('sku', form.sku);
      fd.append('shortDescription', form.shortDescription);
      fd.append('description', form.description);
      fd.append('category', form.category);
      fd.append('brand', form.brand);
      fd.append('basePrice', form.basePrice);
      if (form.salePrice) fd.append('salePrice', form.salePrice);
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
      fd.append('metaTitle', form.metaTitle);
      fd.append('metaDescription', form.metaDescription);
      fd.append('featured', form.featured ? 'true' : 'false');
      fd.append('returnable', form.returnable ? 'true' : 'false');
      fd.append('warranty', form.warranty || '');

      // variants JSON (optional). Your backend should parse JSON string to array.
      if (variantsJson?.trim()) fd.append('variants', variantsJson);

      // images => multipart key 'images' (router accepts upload.array("images", 10))
      images.forEach((f) => fd.append('images', f));

      // POST to /api/v1/products (router has router.post("/", ...))
      const res = await api.post('/products', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const body = res?.data ?? res;
      if (body?.success || res?.success) {
        toast.success('Product created');
        // go to products list
        router.push('/admin/products');
      } else {
        toast.error(body?.message || 'Failed to create product');
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || err.message || 'Error creating product');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout title="Add Product">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2>Add Product</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
            {/* Left: main form */}
            <div>
              <div className="form-row">
                <label>Title</label>
                <input name="title" value={form.title} onChange={handleChange} required />
              </div>

              <div className="form-row">
                <label>Slug</label>
                <input name="slug" value={form.slug} onChange={handleChange} />
              </div>

              <div className="form-row">
                <label>SKU</label>
                <input name="sku" value={form.sku} onChange={handleChange} />
              </div>

              <div className="form-row">
                <label>Short description</label>
                <input name="shortDescription" value={form.shortDescription} onChange={handleChange} />
              </div>

              <div className="form-row">
                <label>Description (HTML allowed)</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={6} />
              </div>

              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <label>Base price (₹)</label>
                  <input type="number" name="basePrice" value={form.basePrice} onChange={handleChange} />
                </div>
                <div>
                  <label>Sale price (₹)</label>
                  <input type="number" name="salePrice" value={form.salePrice} onChange={handleChange} />
                </div>
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
                <label>Variants (optional JSON)</label>
                <textarea
                  placeholder='Example: [{"sku":"SHJ-001","metal":"Gold","size":"6","price":45000,"inventory":5}]'
                  value={variantsJson}
                  onChange={(e) => setVariantsJson(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="form-row">
                <label>Category (ID)</label>
                <input name="category" value={form.category} onChange={handleChange} placeholder="category id" />
              </div>

              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <label>Stock quantity</label>
                  <input type="number" name="stockQuantity" value={form.stockQuantity} onChange={handleChange} />
                </div>
                <div>
                  <label>Manage stock</label>
                  <select name="manageStock" value={String(form.manageStock)} onChange={(e) => setForm(p => ({...p, manageStock: e.target.value === 'true'}))}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button className="btn" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Create product'}</button>
                <button type="button" className="btn ghost" onClick={() => {
                  setForm({
                    title: '', slug:'', sku:'', shortDescription:'', description:'', category:'', brand:'', basePrice:'', salePrice:'',
                    productType:'single', isPublished:true, isMadeToOrder:false, leadTimeDays:7, allowResizing:true, allowEngraving:false, makingCharges:0,
                    stockQuantity:0, manageStock:true, weightGrams:'', metaTitle:'', metaDescription:'', featured:false, returnable:false, warranty:''
                  });
                  setImages([]);
                  setImagePreviews([]);
                  setVariantsJson('');
                }}>Reset</button>
              </div>
            </div>

            {/* Right: media & meta */}
            <aside>
              <div className="card" style={{ marginBottom: 12 }}>
                <strong>Media</strong>
                <input type="file" accept="image/*" multiple onChange={handleImages} style={{ marginTop: 8 }} />
                {imagePreviews.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                    {imagePreviews.map((p, i) => <img key={i} src={p} style={{ height: 80, borderRadius: 6 }} />)}
                  </div>
                )}
              </div>

              <div className="card" style={{ marginBottom: 12 }}>
                <label>Brand</label>
                <input name="brand" value={form.brand} onChange={handleChange} />
                <div style={{ height: 8 }} />
                <label>Weight (grams)</label>
                <input type="number" name="weightGrams" value={form.weightGrams} onChange={handleChange} />
              </div>

              <div className="card">
                <label>Meta title</label>
                <input name="metaTitle" value={form.metaTitle} onChange={handleChange} />
                <div style={{ height: 8 }} />
                <label>Meta description</label>
                <input name="metaDescription" value={form.metaDescription} onChange={handleChange} />
              </div>
            </aside>
          </div>
        </div>
      </form>
    </Layout>
  );
}
