// pages/_app.js
import '../styles/globals.css';
import AuthProvider, { useAuth } from '../components/AuthProvider';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function AppWrapper({ Component, pageProps }) {
  return (
    <AuthProvider>
        <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
      <RouteGuard>
        <Component {...pageProps} />
      </RouteGuard>
    </AuthProvider>
  );
}

function RouteGuard({ children }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Protect admin routes but exclude the admin login page
  const isAdminRoute = router.pathname.startsWith('/admin') && router.pathname !== '/admin/login';

  useEffect(() => {
    if (!isAdminRoute) return;
    if (loading) return;
    if (!user) router.replace('/admin/login'); // redirect to admin login
  }, [isAdminRoute, user, loading, router]);

  if (isAdminRoute && loading) return <div style={{ padding: 20 }}>Checking authentication...</div>;

  return children;
}

export default AppWrapper;
