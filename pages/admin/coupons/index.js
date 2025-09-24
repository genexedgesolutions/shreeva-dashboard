import useSWR from 'swr';
import api from '../../../lib/api';
import Layout from '../../../components/Layout';

export default function Coupons(){
  const { data } = useSWR('/coupon', url=>api.get(url));
  const coupons = data?.data || [];

  return (
    <Layout title="Coupons">
      <div className="card">
        <h3>Coupon Codes</h3>
        <ul>
          {coupons.map(c=> <li key={c._id}>{c.code} — {c.discount}%</li>)}
        </ul>
      </div>
    </Layout>
  )
}
