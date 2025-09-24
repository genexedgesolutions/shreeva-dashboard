// pages/admin/products/category/new.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import api from '../../../lib/api';
import { toast } from 'react-toastify';

export default function NewCategory() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    display_type: 'default',
    parent: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    isActive: true,
  });
  const [images, setImages] = useState([]); // File objects
  const [thumbnail, setThumbnail] = useState(null); // single file for thumbnail
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleFiles(e) {
    setImages(Array.from(e.target.files));
  }

  function handleThumbnail(e) {
    setThumbnail(e.target.files[0] || null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Name is required');
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
      fd.append('meta_keywords', form.meta_keywords);
      fd.append('isActive', form.isActive ? 'true' : 'false');

      if (thumbnail) fd.append('image', thumbnail); // thumbnail as first image field — your multer accepts "image"
      images.forEach((f) => fd.append('image', f)); // multiple images

      const res = await api.post('/categories', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const body = res?.data ?? res;
      if (body?.success) {
        toast.success('Category created');
        router.push('/admin/categories');
      } else {
        toast.error(body?.message || 'Create failed');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Add Category">
      <div className="card">
        <h3>Add Category</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <label>Slug</label>
            <input name="slug" value={form.slug} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows="3" />
          </div>

          <div className="form-row">
            <label>Parent Category (ID)</label>
            <input name="parent" value={form.parent} onChange={handleChange} placeholder="parent category id (optional)" />
          </div>

          <div className="form-row">
            <label>Thumbnail (single)</label>
            <input type="file" accept="image/*" onChange={handleThumbnail} />
          </div>

          <div className="form-row">
            <label>Images (multiple)</label>
            <input type="file" accept="image/*" multiple onChange={handleFiles} />
          </div>

          <div className="form-row">
            <label>Display Type</label>
            <select name="display_type" value={form.display_type} onChange={handleChange}>
              <option value="default">Default</option>
              <option value="products">Products</option>
              <option value="subcategories">Subcategories</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div className="form-row">
            <label>Meta Title</label>
            <input name="meta_title" value={form.meta_title} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Meta Description</label>
            <input name="meta_description" value={form.meta_description} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Meta Keywords (comma separated)</label>
            <input name="meta_keywords" value={form.meta_keywords} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} /> Active
            </label>
          </div>

          <div style={{ marginTop: 12 }}>
            <button className="btn" type="submit" disabled={loading}>{loading ? 'Saving…' : 'Create Category'}</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
