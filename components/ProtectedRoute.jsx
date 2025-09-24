// components/ProtectedRoute.jsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../lib/api';

// Optional: you can use your AuthProvider's useAuth instead, but this direct API check is SSR-safe.
export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function check() {
      try {
        // call your protected endpoint which returns user info when logged in
        const res = await api.get('/auth/user-auth');
        // expected res: { Status: 'success', user: {...} } or similar
        const user = res?.user ?? res?.data?.user ?? null;

        if (!user && mounted) {
          // not signed in -> redirect to login
          router.replace('/admin/login');
        } else {
          // signed in -> continue
          if (mounted) setChecking(false);
        }
      } catch (err) {
        // any error -> redirect to login
        if (mounted) {
          router.replace('/admin/login');
        }
      }
    }

    check();

    return () => { mounted = false; };
  }, [router]);

  if (checking) {
    // a simple client-side loader while auth is checked
    return <div style={{padding:20}}>Checking authentication...</div>;
  }

  return children;
}
