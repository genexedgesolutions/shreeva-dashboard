import { useRouter } from 'next/router';
import useSWR from 'swr';
import api from '../../../../lib/api';
import Layout from '../../../../components/Layout';

const fetcher = (url) => api.get(url);

export default function ViewBlog() {
  const router = useRouter();
  const { slug } = router.query;

  const { data, error } = useSWR(slug ? `/blogs/${slug}` : null, fetcher);

  if (error) return <Layout title="View Blog"><div className="card">❌ Error loading blog</div></Layout>;
  if (!data) return <Layout title="View Blog"><div className="card">⏳ Loading...</div></Layout>;

  const blog = data;

  return (
    <Layout title="View Blog">
      <div className="card">
        <h2>{blog.title}</h2>
        <p><strong>Category:</strong> {blog.category}</p>
        <p><strong>Author:</strong> {blog.author}</p>
        <p><strong>Date:</strong> {blog.date}</p>
        <p><strong>Description:</strong> {blog.description}</p>
        {blog.image?.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <h4>Images</h4>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {blog.image.map((img, idx) => (
                <img key={idx} src={img} alt={blog.title} style={{ height: 100, borderRadius: 6 }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
