// pages/admin/orders/index.js
import useSWR from 'swr';
import api from '../../../lib/api';
import Layout from '../../../components/Layout';
import AppDataTable from '../../../components/DataTable';
import { useMemo } from 'react';
import { FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Link from 'next/link';

const fetcher = (url) => api.get(url, { params: { _t: Date.now() } });

export default function OrdersPage() {
  const { data, error, isValidating, mutate } = useSWR('/order', fetcher, {
    revalidateOnFocus: true,
  });

  const orders = data?.orders || data?.data || [];

  const handleDelete = async (id, orderNo) => {
    if (!confirm(`Delete Order #${orderNo}?`)) return;
    try {
      await api.delete(`/order/${id}`);
      toast.success(`Order #${orderNo} deleted`);
      mutate();
    } catch (err) {
      toast.error('Failed to delete order');
    }
  };

  const columns = useMemo(
    () => [
      {
        id: 'orderNo',
        name: 'Order No',
        selector: (row) => row.order_id || row._id,
        sortable: true,
        width: '90px',
      },
      {
        id: 'customer',
        name: 'Customer',
        selector: (row) => row.firstName+' '+row.lastName || row.customerName || '—',
        sortable: true,
        wrap: true,
      },
      {
        id: 'total',
        name: 'Total',
        selector: (row) =>
          row.totalPrice ? `₹${row.totalPrice}` : '—',
        sortable: true,
      },
      {
        id: 'status',
        name: 'Status',
        selector: (row) => row.orderStatus || '—',
        sortable: true,
      },
      {
        id: 'paymentMethod',
        name: 'Payment Method',
        selector: (row) => row.paymentMethod || '—',
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
            {/* View */}
            <Link href={`/admin/orders/${row._id}/view`} legacyBehavior>
              <a
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
            </Link>

            {/* Edit */}
            <Link href={`/admin/orders/${row._id}/edit`} legacyBehavior>
              <a
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
            </Link>

            {/* Delete */}
            {/* <button
              className="btn"
              style={{
                background: '#ef4444',
                color: 'white',
                padding: '4px 8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
              onClick={() => handleDelete(row._id, row.orderNo)}
            >
              <FiTrash2 />
            </button> */}
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
      <Layout title="Orders">
        <div className="card">❌ Error loading orders</div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout title="Orders">
        <div className="card">⏳ Loading…</div>
      </Layout>
    );
  }

  return (
    <Layout title="Orders">
      <div className="card">
        {isValidating && <div style={{ marginBottom: 8 }}>🔄 Refreshing…</div>}
        <AppDataTable
          title={`Orders (${orders.length})`}
          columns={columns}
          data={orders}
          selectable={true}
          defaultSortFieldId="orderNo"
        />
      </div>
    </Layout>
  );
}
