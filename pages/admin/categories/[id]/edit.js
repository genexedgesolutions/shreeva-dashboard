// pages/admin/products/category/[id]/edit.js
import { useRouter } from 'next/router';
import useSWR from 'swr';
import api from '../../../../lib/api';
import Layout from '../../../../components/Layout';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';

const fetcher = (url) => api.get(url);

export default function EditCategory() {
  const router = useRouter();
  const { id } = router.query;

  const { data, error, mutate } = useSWR(
    id ? `/categories/${id}` : null,
    fetcher
  );

  const [form, setForm] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!data) return;
    const cat = data?.data || data?.category || data;
    setForm({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      display_type: cat.display_type || 'default',
      parent: cat.parent || '',
      meta_title: cat.meta_title || '',
      meta_description: cat.meta_description || '',
      meta_keywords: Array.isArray(cat.meta_keywords)
        ? cat.meta_keywords.join(', ')
        : (cat.meta_keywords || ''),
      isActive: typeof cat.isActive === 'boolean' ? cat.isActive : true,
      _id: cat._id || cat.id,
      images_existing: cat.images || [],
      thumbnail_existing: cat.thumbnail || '',
    });
  }, [data]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  }
  function handleThumb(e) {
    setThumbnail(e.target.files[0] || null);
  }
  function handleImages(e) {
    setImages(Array.from(e.target.files));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form || !form.name) {
      toast.error('Name required');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      if (form.slug) fd.append('slug', form.slug);
      fd.append('description', form.description);
      fd.append('display_type', form.display_type);
      if (form.parent) fd.append('parent', form.parent);
      fd.append('meta_title', form.meta_title);
      fd.append('meta_description', form.meta_description);
      fd.append('meta_keywords', form.meta_keywords || '');
      fd.append('isActive', form.isActive ? 'true' : 'false');

      if (thumbnail) fd.append('image', thumbnail);
      images.forEach((f) => fd.append('image', f));

      const res = await api.put(`/categories/${form._id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const body = res?.data ?? res;
      if (body?.success) {
        toast.success('Category updated');
        mutate();
        router.push('/admin/categories');
      } else {
        toast.error(body?.message || 'Update failed');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  if (error) {
    return (
      <Layout title="Edit Category">
        <div className="card">❌ Error loading category</div>
      </Layout>
    );
  }
  if (!form) {
    return (
      <Layout title="Edit Category">
        <div className="card">⏳ Loading…</div>
      </Layout>
    );
  }

  return (
    <Layout title={`Edit Category: ${form.name}`}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <h2>Edit Category</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link
            href="/admin/products/category"
            legacyBehavior
          >
            <a className="btn ghost">Back</a>
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ padding: 20 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 300px',
              gap: 20,
            }}
          >
            {/* Left column: form fields */}
            <div>
              <div className="form-row">
                <label>Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <label>Slug</label>
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <label>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div className="form-row">
                <label>Parent (ID)</label>
                <input
                  name="parent"
                  value={form.parent}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <label>Display type</label>
                <select
                  name="display_type"
                  value={form.display_type}
                  onChange={handleChange}
                >
                  <option value="default">Default</option>
                  <option value="products">Products</option>
                  <option value="subcategories">Subcategories</option>
                  <option value="both">Both</option>
                </select>
              </div>

              <div className="form-row">
                <label>Meta title</label>
                <input
                  name="meta_title"
                  value={form.meta_title}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <label>Meta description</label>
                <input
                  name="meta_description"
                  value={form.meta_description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <label>Meta keywords</label>
                <input
                  name="meta_keywords"
                  value={form.meta_keywords}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                  />{' '}
                  Active
                </label>
              </div>

              <div style={{ marginTop: 16 }}>
                <button className="btn" type="submit" disabled={loading}>
                  {loading ? 'Saving…' : 'Save changes'}
                </button>
                <button
                  type="button"
                  className="btn ghost"
                  style={{ marginLeft: 8 }}
                  onClick={() => mutate()}
                >
                  Refresh
                </button>
              </div>
            </div>

            {/* Right column: media preview */}
            <aside>
              <div className="card" style={{ marginBottom: 12 }}>
                <strong>Thumbnail</strong>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumb}
                  style={{ marginTop: 8 }}
                />
                {form.thumbnail_existing && (
                  <div style={{ marginTop: 8 }}>
                    <img
                      src={form.thumbnail_existing}
                      alt="thumb"
                      style={{ height: 80, borderRadius: 6 }}
                    />
                  </div>
                )}
              </div>

              <div className="card">
                <strong>Images</strong>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImages}
                  style={{ marginTop: 8 }}
                />
                {form.images_existing?.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 6,
                      marginTop: 8,
                    }}
                  >
                    {form.images_existing.map((u, i) => (
                      <img
                        key={i}
                        src={u}
                        alt={`img-${i}`}
                        style={{ height: 60, borderRadius: 6 }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </form>
    </Layout>
  );
}
