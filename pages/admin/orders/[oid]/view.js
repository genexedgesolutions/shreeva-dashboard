// pages/admin/orders/[oid]/view.js
import { useRouter } from 'next/router';
import useSWR from 'swr';
import api from '../../../../lib/api';
import Layout from '../../../../components/Layout';
import Link from 'next/link';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';

const fetcher = (url) => api.get(url, { params: { _t: Date.now() } });

export default function OrderView() {
  const router = useRouter();
  const { oid } = router.query; // this is orderId as provided in routes

  const { data, error, mutate } = useSWR(
    oid ? `/order/order-details/${oid}` : null,
    fetcher
  );

  if (error) {
    return (
      <Layout title="Order">
        <div className="card">❌ Error loading order</div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout title="Order">
        <div className="card">⏳ Loading…</div>
      </Layout>
    );
  }

  // API may return order inside data.order or data
  const order = data?.order || data;

  const handleCancel = async () => {
    if (!confirm(`Cancel order ${order.orderId || oid}? This cannot be undone.`)) return;
    try {
      await api.delete(`/order/cancel-order/${order.orderId || oid}`);
      toast.success('Order cancelled');
      mutate();
    } catch (err) {
      console.error(err);
      toast.error(err?.message || 'Failed to cancel order');
    }
  };

  return (
    <Layout title={`Order ${order.orderId || oid}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2>Order {order.orderId || oid}</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href={`/admin/orders/${order.orderId || oid}/edit`} legacyBehavior>
            <a className="btn"><FiEdit /> Edit</a>
          </Link>
          <button className="btn" onClick={handleCancel} style={{ background: '#ef4444' }}>
            <FiTrash2 /> Cancel Order
          </button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <h4>Customer</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div><strong>Name:</strong> {order.firstName} {order.lastName}</div>
          <div><strong>Email:</strong> {order.email}</div>
          <div><strong>Phone:</strong> {order.phone}</div>
          <div><strong>Order created:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <h4>Shipping Address</h4>
        {order.address ? (
          <div>
            <div>{order.address.street}, {order.address.city}</div>
            <div>{order.address.state} — {order.address.pincode}</div>
            <div>{order.address.country}</div>
          </div>
        ) : <div className="kv muted">No address</div>}
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <h4>Items</h4>
        <table className="table">
          <thead>
            <tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th></tr>
          </thead>
          <tbody>
            {Array.isArray(order.cartProducts) && order.cartProducts.length > 0 ? order.cartProducts.map((p, idx) => (
              <tr key={idx}>
                <td style={{ maxWidth: 300 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="avatar" /> : null}
                    <div>
                      <div style={{ fontWeight: 700 }}>{p.name}</div>
                      <div className="kv">{p.shortDescription}</div>
                    </div>
                  </div>
                </td>
                <td>₹{p.price?.toFixed?.(2) ?? p.price}</td>
                <td>{p.quantity}</td>
                <td>₹{((p.price || 0) * (p.quantity || 0)).toFixed(2)}</td>
              </tr>
            )) : (
              <tr><td colSpan={4}>No items</td></tr>
            )}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12, gap: 12 }}>
          <div className="kv"><strong>Subtotal:</strong> ₹{order.totalPrice?.toFixed?.(2) ?? order.totalPrice}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <h4>Payment & Shipping</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div><strong>Payment Method:</strong> {order.paymentMethod}</div>
          <div><strong>Payment Status:</strong> {order.paymentStatus}</div>
          <div><strong>Selected Shipping:</strong> {order.selectedShippingOption?.name || JSON.stringify(order.selectedShippingOption) || '—'}</div>
          <div><strong>Note:</strong> {order.note || '—'}</div>
        </div>
      </div>

      <div className="card">
        <h4>Status & History</h4>
        <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
          <div style={{ minWidth: 200 }}>
            <div className="kv"><strong>Current:</strong></div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{order.orderStatus}</div>
          </div>

          <div style={{ flex: 1 }}>
            <div className="kv"><strong>History</strong></div>
            <ul>
              {Array.isArray(order.statusHistory) && order.statusHistory.length > 0 ? (
                order.statusHistory.map((h, i) => (
                  <li key={i}>{h.status} — {h.updatedAt ? new Date(h.updatedAt).toLocaleString() : '-'}</li>
                ))
              ) : (
                <li className="kv muted">No history</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
