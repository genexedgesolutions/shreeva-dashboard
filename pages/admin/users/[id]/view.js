// pages/admin/users/[id]/view.js
import { useRouter } from 'next/router';
import useSWR from 'swr';
import api from '../../../../lib/api';
import Layout from '../../../../components/Layout';

const fetcher = (url) => api.get(url);

export default function UserViewPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data, error } = useSWR(
    id ? `/auth/getUser/${id}` : null,
    fetcher
  );

  if (error) return <Layout><div className="card">❌ Error loading user</div></Layout>;
  if (!data) return <Layout><div className="card">⏳ Loading…</div></Layout>;

  const user = data?.data || {};

  return (
    <Layout title={`User: ${user.firstName} ${user.lastName}`}>
      <div className="card">
        <h3>User Details</h3>
        <table className="table">
          <tbody>

            <tr><th>Name</th><td>{user.firstName} {user.lastName}</td></tr>
            <tr><th>Email</th><td>{user.email}</td></tr>
            <tr><th>Phone</th><td>{user.phone || '—'}</td></tr>
            <tr><th>Role</th><td>{user.role}</td></tr>
            <tr><th>Created</th><td>{user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</td></tr>
            <tr><th>Updated</th><td>{user.updatedAt ? new Date(user.updatedAt).toLocaleString() : '-'}</td></tr>
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
