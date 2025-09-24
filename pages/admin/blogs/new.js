import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import api from '../../../lib/api';
import { toast } from 'react-toastify';

export default function AddBlog() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: '',
    description: '',
    description2: '',
    description3: '',
    author: 'Shreeva Jewels',
    date: new Date().toISOString().split('T')[0],
  });

  const [images, setImages] = useState([]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e) {
    setImages(Array.from(e.target.files));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }
      images.forEach((img) => formData.append('image', img));

      await api.post('/blogs/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Blog created successfully!');
      router.push('/admin/blogs');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create blog');
    }
  }

  return (
    <Layout title="Add Blog">
      <div className="card">
        <h3>Create New Blog</h3>
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-row">
            <label>Title</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} />
          </div>

          {/* Slug */}
          <div className="form-row">
            <label>Slug</label>
            <input type="text" name="slug" value={form.slug} onChange={handleChange} />
          </div>

          {/* Category */}
          <div className="form-row">
            <label>Category</label>
            <input type="text" name="category" value={form.category} onChange={handleChange} />
          </div>

          {/* Author */}
          <div className="form-row">
            <label>Author</label>
            <input type="text" name="author" value={form.author} onChange={handleChange} />
          </div>

          {/* Date */}
          <div className="form-row">
            <label>Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} />
          </div>

          {/* Description */}
          <div className="form-row">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          {/* Optional Description 2 */}
          <div className="form-row">
            <label>Description 2</label>
            <textarea
              name="description2"
              value={form.description2}
              onChange={handleChange}
              rows="3"
            />
          </div>

          {/* Optional Description 3 */}
          <div className="form-row">
            <label>Description 3</label>
            <textarea
              name="description3"
              value={form.description3}
              onChange={handleChange}
              rows="3"
            />
          </div>

          {/* Images */}
          <div className="form-row">
            <label>Upload Images</label>
            <input type="file" name="images" multiple onChange={handleFileChange} />
          </div>

          {/* Submit */}
          <div style={{ marginTop: 16 }}>
            <button type="submit" className="btn">Create Blog</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
