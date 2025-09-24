// pages/admin/orders/[oid]/edit.js
import { useRouter } from 'next/router';
import useSWR from 'swr';
import api from '../../../../lib/api';
import Layout from '../../../../components/Layout';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';

const fetcher = (url) => api.get(url, { params: { _t: Date.now() } });

export default function OrderEdit() {
  const router = useRouter();
  const { oid } = router.query; // orderId

  const { data, error, mutate } = useSWR(
    oid ? `/order/order-details/${oid}` : null,
    fetcher
  );

  const [form, setForm] = useState({
    orderStatus: '',
    paymentStatus: '',
    note: '',
    selectedShippingOption: {},
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      const order = data?.order || data;
      setForm({
        orderStatus: order.orderStatus || '',
        paymentStatus: order.paymentStatus || '',
        note: order.note || '',
        selectedShippingOption: order.selectedShippingOption || {},
      });
    }
  }, [data]);

  if (error) {
    return (
      <Layout title="Edit Order">
        <div className="card">❌ Error loading order</div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout title="Edit Order">
        <div className="card">⏳ Loading…</div>
      </Layout>
    );
  }

  const order = data?.order || data;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      // update status (your backend route expects orderId in body)
      await api.put('/order/update-status', {
        orderId: oid,
        orderStatus: form.orderStatus,
        paymentStatus: form.paymentStatus,
        note: form.note,
        // optionally pass selectedShippingOption
        selectedShippingOption: form.selectedShippingOption,
      });
      toast.success('Order updated');
      mutate();
      // small delay then go back to view
      setTimeout(() => router.push(`/admin/orders`), 400);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to update order');
    } finally {
      setSaving(false);
    }
  }

  async function handleCancel() {
    if (!confirm('Cancel this order?')) return;
    try {
      await api.delete(`/order/cancel-order/${order.orderId || oid}`);
      toast.success('Order cancelled');
      mutate();
      setTimeout(() => router.push('/admin/orders'), 400);
    } catch (err) {
      console.error(err);
      toast.error('Failed to cancel order');
    }
  }

  return (
    <Layout title={`Edit Order ${order.orderId || oid}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2>Edit Order {order.orderId || oid}</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href={`/admin/orders/${order.orderId || oid}/view`} legacyBehavior><a className="btn ghost">View</a></Link>
          <button className="btn" onClick={handleCancel} style={{ background: '#ef4444' }}>Cancel Order</button>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
            <div>
              <div className="form-row">
                <label>Order Status</label>
                <select name="orderStatus" value={form.orderStatus} onChange={handleChange}>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="form-row">
                <label>Payment Status</label>
                <select name="paymentStatus" value={form.paymentStatus} onChange={handleChange}>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>

              <div className="form-row">
                <label>Note</label>
                <textarea name="note" value={form.note} onChange={handleChange} rows="4" />
              </div>

              <div style={{ marginTop: 12 }}>
                <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
                <button type="button" className="btn ghost" style={{ marginLeft: 8 }} onClick={() => mutate()}>
                  Refresh
                </button>
              </div>
            </div>

            <aside>
              <div className="card">
                <strong>Order summary</strong>
                <div style={{ marginTop: 8 }} className="kv">
                  <div><strong>Customer:</strong> {order.firstName} {order.lastName}</div>
                  <div style={{ marginTop: 6 }}><strong>Total:</strong> ₹{order.totalPrice?.toFixed?.(2) ?? order.totalPrice}</div>
                  <div style={{ marginTop: 6 }}><strong>Items:</strong> {order.cartProducts?.length ?? 0}</div>
                  <div style={{ marginTop: 6 }}><strong>Current status:</strong> {order.orderStatus}</div>
                </div>
              </div>

              <div className="card" style={{ marginTop: 12 }}>
                <strong>Status history</strong>
                <div style={{ marginTop: 8 }}>
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
            </aside>
          </div>
        </div>
      </form>
    </Layout>
  );
}
