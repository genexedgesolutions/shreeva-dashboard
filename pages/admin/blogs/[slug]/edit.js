import { useRouter } from 'next/router';
import useSWR from 'swr';
import api from '../../../../lib/api';
import Layout from '../../../../components/Layout';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const fetcher = (url) => api.get(url);

export default function EditBlog() {
  const router = useRouter();
  const { slug } = router.query;
console.log(slug);

  const { data } = useSWR(slug ? `/blogs/${slug}` : null, fetcher);

  const [form, setForm] = useState(null);

  useEffect(() => {
    if (data) {
      // if API returns { success, blog }, adjust here
      const blog = data?.blog || data;
      setForm(blog);
    }
  }, [data]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.put(`/blogs/update/${form._id}`, form);
      toast.success('✅ Blog updated successfully');
      router.push('/admin/blogs');
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to update blog');
    }
  }

  if (!form) {
    return (
      <Layout title="Edit Blog">
        <div className="card">⏳ Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout title="Edit Blog">
      <div className="card">
        <h3>Edit Blog</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Title</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Slug</label>
            <input type="text" name="slug" value={form.slug} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Category</label>
            <input type="text" name="category" value={form.category} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
            />
          </div>
          <div style={{ marginTop: 16 }}>
            <button type="submit" className="btn">💾 Save Changes</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
