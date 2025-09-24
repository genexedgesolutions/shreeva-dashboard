// pages/admin/users/add.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import api from '../../../lib/api';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function AddUserPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    role: 'staff',
    address: {
      houseNo: '',
      street: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
    },
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setForm((prev) => ({ ...prev, address: { ...prev.address, [key]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  function validate() {
    if (!form.firstName.trim()) return 'First name is required';
    if (!form.email.trim()) return 'Email is required';
    if (!form.password.trim() || form.password.length < 6) return 'Password must be at least 6 characters';
    if (!form.phone.trim()) return 'Phone is required';
    const addr = form.address;
    if (!addr.houseNo.trim()) return 'House no is required';
    if (!addr.street.trim()) return 'Street is required';
    if (!addr.city.trim()) return 'City is required';
    if (!addr.state.trim()) return 'State is required';
    if (!addr.country.trim()) return 'Country is required';
    if (!addr.pincode.trim()) return 'Pincode is required';
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    if (v) {
      toast.error(v);
      return;
    }

    setLoading(true);
    try {
      const payload = { ...form };
      const res = await api.post('/auth/register', payload);
      const body = res?.data ?? res;
      if (body?.success) {
        toast.success('User added successfully');
        router.push('/admin/users');
      } else {
        toast.error(body?.message || 'Failed to add user');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Server error';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Add User">
      <div className="card">
        <h3 style={{ marginBottom: 16 }}>➕ Add New User</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-row" style={{ position: 'relative' }}>
            <label>Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              minLength={6}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: 12,
                top: 36,
                cursor: 'pointer',
                color: 'var(--muted)',
              }}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <div className="form-row">
            <label>Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>

          <h4 style={{ marginTop: 20 }}>Address</h4>

          <div className="form-row">
            <label>House No</label>
            <input
              type="text"
              name="address.houseNo"
              value={form.address.houseNo}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Street</label>
            <input
              type="text"
              name="address.street"
              value={form.address.street}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>City</label>
            <input
              type="text"
              name="address.city"
              value={form.address.city}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>State</label>
            <input
              type="text"
              name="address.state"
              value={form.address.state}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Country</label>
            <input
              type="text"
              name="address.country"
              value={form.address.country}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Pincode</label>
            <input
              type="text"
              name="address.pincode"
              value={form.address.pincode}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginTop: 20 }}>
            <button className="btn" type="submit" disabled={loading}>
              {loading ? '⏳ Creating…' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
