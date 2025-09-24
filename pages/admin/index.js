import Layout from '../../components/Layout';

export default function AdminHome(){
  return (
    <Layout title="Admin Dashboard">
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        <div className="card">Total Products<br/><strong>--</strong></div>
        <div className="card">Total Orders<br/><strong>--</strong></div>
        <div className="card">Today's Revenue<br/><strong>--</strong></div>
        <div className="card">Pending Orders<br/><strong>--</strong></div>
      </div>

      <div style={{marginTop:16}} className="card">
        <h3>Recent Orders</h3>
        <p>Connect to <code>/api/v1/order</code> to populate this list.</p>
      </div>
    </Layout>
  )
}