// pages/admin/users/[id]/edit.js
import { useRouter } from 'next/router';
import useSWR from 'swr';
import api from '../../../../lib/api';
import Layout from '../../../../components/Layout';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const fetcher = (url) => api.get(url);

export default function UserEditPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data, error } = useSWR(
    id ? `/auth/getUser/${id}` : null,
    fetcher
  );

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
  });

  useEffect(() => {
    if (data?.data) {
      const u = data.data;
      setForm({
        firstName: u.firstName || '',
        lastName: u.lastName || '',
        email: u.email || '',
        phone: u.phone || '',
        role: u.role || '',
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/update-profile', { ...form, _id: id });
      toast.success('User updated successfully');
      router.push(`/admin/users/`);
    } catch (err) {
      toast.error(err?.message || 'Update failed');
    }
  };

  if (error) return <Layout><div className="card">❌ Error loading user</div></Layout>;
  if (!data) return <Layout><div className="card">⏳ Loading…</div></Layout>;

  return (
    <Layout title="Edit User">
      <div className="card">
        <h3>Edit User</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>First Name</label>
            <input type="text" name="firstName" value={form.firstName} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Last Name</label>
            <input type="text" name="lastName" value={form.lastName} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Phone</label>
            <input type="text" name="phone" value={form.phone} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Role</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="superadmin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="customer">Customer</option>
            </select>
          </div>
          <button className="btn" type="submit">Save Changes</button>
        </form>
      </div>
    </Layout>
  );
}
