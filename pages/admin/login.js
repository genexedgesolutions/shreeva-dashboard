// pages/admin/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../components/AuthProvider';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login({ email, password });
      setLoading(false);

      if (result.ok) {
        toast.success('Signed in — redirecting…');
        router.replace('/admin');
      } else {
        toast.error(result.error?.message || 'Invalid credentials');
      }
    } catch (error) {
      setLoading(false);
      toast.error(error?.message || 'Login failed');
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="brand"></h1>
        <img src='https://frontend.shreevajewels.com/images/logo/logo-rec.png' />
        <p className="subtitle">Welcome back! Please sign in</p>

        <form onSubmit={submit}>
          <div className="form-row">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Signing in…' : 'Login'}
          </button>

          <div className="extra-links">
            <a href="/admin/forgot-password">Forgot password?</a>
          </div>
        </form>

        <div className="footer">
          © {new Date().getFullYear()} Shreeva
        </div>
      </div>

      <style jsx>{`
      
        .login-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
           color: white !important;
    background: linear-gradient(135deg, rgb(75, 0, 85) 0%, rgb(106, 13, 173) 40%, rgb(200, 162, 74) 100%) !important;
          padding: 20px;
        }

        .login-card {
          background: #fff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          width: 100%;
          max-width: 400px;
          text-align: center;
        }

        .brand {
          font-size: 28px;
          font-weight: 700;
          color: #0ea5a4;
          margin-bottom: 8px;
        }
        .login-card img {
        width:100%;
           margin-bottom: 0px;
        }

        .subtitle {
          color: #6b7280;
          margin-Top: 0px;
          margin-bottom: 20px;
        }

        .form-row {
          margin-bottom: 15px;
        }

        .form-row input {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 15px;
        }

        .form-row input:focus {
          border-color: #0ea5a4;
          outline: none;
          box-shadow: 0 0 0 2px rgba(14,165,164,0.2);
        }

        .btn {
          width: 100%;
          padding: 12px;
          background: #0ea5a4;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          margin-top: 5px;
          text-align:center;
          justify-content:center;
        }

        .btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .extra-links {
          margin-top: 12px;
          font-size: 14px;
        }

        .extra-links a {
          color: #0ea5a4;
          text-decoration: none;
        }

        .footer {
          margin-top: 20px;
          font-size: 13px;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}
