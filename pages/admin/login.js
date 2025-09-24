// pages/admin/login.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../components/AuthProvider';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Redirect if already logged in (client-side)
  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/admin');
    }
  }, [authLoading, user, router]);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login({ email, password });
      setLoading(false);

      if (result.ok) {
        toast.success('Signed in — redirecting…');
        setTimeout(() => router.replace('/admin'), 400);
      } else {
        const message = result.error?.message || result.error || 'Invalid credentials';
        toast.error(message);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error?.message || 'Login failed');
    }
  }

  function fillDemo() {
    setEmail('info@shreevajewels.com');
    setPassword('password');
    toast.info('Demo credentials filled');
  }

  return (
    <Layout title="Admin Login" showSidebar={false}>
      <div className="login-container">
        <div className="login-card">
          {/* Left: branding/marketing - hidden on mobile */}
          {!isMobile && (
            <aside className="login-left">
              <div className="logo">SJ</div>
              <h3 className="headline">Shreeva Jewels Dashboard</h3>
              <p className="muted">Manage products, orders, customers, and content from a single place.</p>

              <ul className="features">
                <li>⟡ Fast product management</li>
                <li>⟡ Order tracking & shipping</li>
                <li>⟡ Coupons & blog management</li>
              </ul>

              <div className="foot-muted kv">Need help? <a href="mailto:info@shreevajewels.com">Contact us</a></div>
            </aside>
          )}

          {/* Right: form */}
          <main className="login-right">
            <div className="login-header">
              <div className="logo-small">SJ</div>
              <div>
                <h2>Admin Sign in</h2>
                <div className="kv muted">Securely access your dashboard</div>
              </div>
            </div>

            <form onSubmit={submit} aria-describedby="login-error">
              <div className="form-row">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@company.com"
                />
              </div>

              <div className="form-row">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>

              <div className="actions-row">
                <button type="submit" className="btn primary" disabled={loading} aria-busy={loading}>
                  {loading ? <span className="spinner" aria-hidden /> : null}
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>

                <button
                  type="button"
                  onClick={fillDemo}
                  className="btn secondary"
                  aria-label="Fill demo credentials"
                >
                  Demo creds
                </button>

                <div className="forgot-link">
                  <a href="/admin/forgot-password" className="kv">Forgot password?</a>
                </div>
              </div>

              <div className="login-tip">
                Tip: Use demo credentials for a quick preview.
              </div>
            </form>
          </main>
        </div>

        <div className="login-footer">
          © {new Date().getFullYear()} Shreeva Jewels — Dashboard
        </div>
      </div>

      <style jsx>{`
      
        .login-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
          background: linear-gradient(to bottom, #f9fafb, #f1f5f9);
        }

        .login-card {
          display: flex;
          width: 100%;
          max-width: 1000px;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05), 0 5px 10px rgba(0, 0, 0, 0.05);
        }

        .login-left {
          flex: 1;
          background: linear-gradient(180deg, #ecfeff, #f0fdfa);
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 20px;
        }

        .login-left .logo {
          width: 80px;
          height: 80px;
          border-radius: 16px;
          background: linear-gradient(135deg, #0ea5a4, #089191);
          color: #fff;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          margin-bottom: 10px;
        }

        .headline {
          margin: 0;
          font-size: 24px;
          color: #0f766e;
          font-weight: 700;
        }

        .features {
          margin-top: 15px;
          padding-left: 20px;
          color: var(--muted);
          line-height: 1.7;
          font-size: 15px;
        }

        .features li {
          margin-bottom: 8px;
        }

        .foot-muted {
          margin-top: auto;
          padding-top: 20px;
        }

        .foot-muted a {
          color: var(--accent);
          text-decoration: underline;
        }

        .login-right {
          flex: 1;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .login-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 30px;
        }

        .logo-small {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          background: linear-gradient(135deg, #0ea5a4, #089191);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 800;
          font-size: 22px;
        }

        .login-header h2 {
          margin: 0;
          color: #1e293b;
        }

        .form-row {
          margin-bottom: 20px;
        }

        .form-row label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #374151;
        }

        .form-row input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-row input:focus {
          outline: none;
          border-color: #0ea5a4;
          box-shadow: 0 0 0 3px rgba(14, 165, 164, 0.2);
        }

        .actions-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          margin-top: 25px;
        }

        .btn {
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .btn.primary {
          background: linear-gradient(135deg, #0ea5a4, #089191);
          color: white;
          min-width: 120px;
        }

        .btn.primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #0d9488, #067a74);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .btn.primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn.secondary {
          background: transparent;
          color: #0ea5a4;
          border: 1px solid #0ea5a4;
        }

        .btn.secondary:hover {
          background: rgba(14, 165, 164, 0.05);
        }

        .forgot-link {
          margin-left: auto;
        }

        .login-tip {
          margin-top: 15px;
          font-size: 14px;
          color: var(--muted);
        }

        .login-footer {
          margin-top: 30px;
          text-align: center;
          color: var(--muted);
          font-size: 14px;
        }

        /* Spinner */
        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          margin-right: 8px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: rgba(255, 255, 255, 0.95);
          animation: spin 0.8s linear infinite;
          vertical-align: middle;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive adjustments */
        @media (max-width: 968px) {
          .login-card {
            flex-direction: column;
            max-width: 500px;
          }
          
          .login-left {
            padding: 30px;
            text-align: center;
          }
          
          .login-left .logo {
            margin: 0 auto 15px;
          }
          
          .features {
            text-align: left;
          }
        }

        @media (max-width: 640px) {
          .login-container {
            padding: 15px;
          }
          
          .login-right {
            padding: 25px;
          }
          
          .actions-row {
            flex-direction: column;
            align-items: stretch;
          }
          
          .forgot-link {
            margin-left: 0;
            text-align: center;
            margin-top: 10px;
          }
        }

        @media (max-width: 480px) {
          .login-header {
            flex-direction: column;
            text-align: center;
            gap: 10px;
          }
          
          .login-right {
            padding: 20px;
          }
        }
      `}</style>
    </Layout>
  );
}