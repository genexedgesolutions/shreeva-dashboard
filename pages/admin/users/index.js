// pages/admin/users/index.js
import useSWR from 'swr';
import api from '../../../lib/api';
import Layout from '../../../components/Layout';
import AppDataTable from '../../../components/DataTable';
import { useMemo } from 'react';
import { toast } from 'react-toastify';
import { FiEye, FiEdit, FiTrash2, FiUserPlus } from 'react-icons/fi'; // 👈 Add icon
import Link from 'next/link';

const fetcher = (url) => api.get(url, { params: { _t: Date.now() } });

export default function AdminUsers() {
  const { data, error, isValidating, mutate } = useSWR('/auth/getAllUser', fetcher, {
    revalidateOnFocus: true,
  });

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete ${name}?`)) return;
    try {
      await api.delete(`/auth/delete/${id}`);
      toast.success('User deleted');
      mutate();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const columns = useMemo(
    () => [
      {
        id: 'name',
        name: 'Name',
        selector: (row) => `${row.firstName ?? ''} ${row.lastName ?? ''}`.trim(),
        sortable: true,
      },
      {
        id: 'email',
        name: 'Email',
        selector: (row) => row.email,
        sortable: true,
      },
      {
        id: 'phone',
        name: 'Phone',
        selector: (row) => row.phone || '—',
      },
      {
        id: 'role',
        name: 'Role',
        selector: (row) => row.role,
        sortable: true,
      },
      {
        id: 'created',
        name: 'Created At',
        selector: (row) =>
          row.createdAt ? new Date(row.createdAt).toLocaleString() : '-',
        sortable: true,
      },
      {
        id: 'actions',
        name: 'Actions',
        cell: (row) => (
          <div style={{ display: 'flex', gap: 6 }}>
            {/* View button */}
            <a
              href={`/admin/users/${row._id}/view`}
              className="btn ghost"
              style={{
                padding: '4px 8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <FiEye />
            </a>

            {/* Edit button */}
            <a
              href={`/admin/users/${row._id}/edit`}
              className="btn"
              style={{
                padding: '4px 8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <FiEdit />
            </a>

            {/* Delete button */}
            <button
              className="btn"
              style={{
                background: '#ef4444',
                color: 'white',
                padding: '4px 8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
              onClick={() =>
                handleDelete(row._id, `${row.firstName} ${row.lastName}`)
              }
            >
              <FiTrash2 />
            </button>
          </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
    ],
    [mutate]
  );

  if (error) {
    return (
      <Layout title="Admin Users">
        <div className="card">❌ Error loading users</div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout title="Admin Users">
        <div className="card">⏳ Loading...</div>
      </Layout>
    );
  }

  const users = data?.users || [];

  return (
    <Layout title="Admin Users">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <h2>Users</h2>
        <Link href="/admin/users/add" legacyBehavior>
          <a className="btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <FiUserPlus /> Add User
          </a>
        </Link>
      </div>

      <div className="card">
        {isValidating && <div style={{ marginBottom: 8 }}>🔄 Refreshing…</div>}
        <AppDataTable
          title={`Users (${users.length})`}
          columns={columns}
          data={users.filter((u) => u.role !== 'customer')}
          selectable={true}
          defaultSortFieldId="name"
        />
      </div>
    </Layout>
  );
}
