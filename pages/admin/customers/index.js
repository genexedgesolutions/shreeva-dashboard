import useSWR from 'swr';
import api from '../../../lib/api';
import Layout from '../../../components/Layout';

export default function Customers(){
  const { data } = useSWR('/users', url=>api.get(url));
  const users = data?.data || [];

  return (
    <Layout title="Customers">
      <div className="card">
        <h3>Customers</h3>
        <table className="table">
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th></tr></thead>
          <tbody>
            {users.map(u=> <tr key={u._id}><td>{u.name}</td><td>{u.email}</td><td>{u.phone}</td></tr>)}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
