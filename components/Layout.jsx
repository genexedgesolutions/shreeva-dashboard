// components/Layout.jsx
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';

export default function Layout({ children, title = 'Dashboard', showSidebar = true, showHeader = true }) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // track which dropdown is open
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    const root = document.querySelector('.container');
    if (!root) return;
    if (mobileOpen) root.classList.add('show-sidebar');
    else root.classList.remove('show-sidebar');
  }, [mobileOpen]);

  function handleLogout() {
    logout();
    toast.success('Logged out');
  }

  function toggleMenu(menuKey) {
    setOpenMenu(openMenu === menuKey ? null : menuKey);
  }

  return (
    <div className="container" style={{ maxWidth: '100%' }}>
      {showHeader && (
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {showSidebar && (
              <button
                className="mobile-toggle"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle sidebar"
                style={{ cursor: 'pointer' }}
              >
                ☰
              </button>
            )}
            <h2 style={{ margin: 0 }}>{title}</h2>
          </div>

          <div className="controls">
            <div style={{ marginRight: 12 }}>
              {user ? <span style={{ fontWeight: 600 }}>{user.firstName || user.name || 'Admin'}</span> : 'Guest'}
            </div>

            {user ? (
              <button onClick={handleLogout} className="btn">Logout</button>
            ) : (
              <Link href="/admin/login" legacyBehavior><a className="btn">Login</a></Link>
            )}
          </div>
        </header>
      )}

      {showSidebar ? (
        <div className="grid">
          <aside className="side">
            <div className="brand">Shreeva Jewels</div>
            <nav className="nav">

              {/* Dashboard */}
              <Link href="/admin" legacyBehavior>
                <a className="active">Dashboard</a>
              </Link>

              {/* Products Section */}
              <div>
                <div
                  className="nav-parent"
                  onClick={() => toggleMenu('products')}
                >
                  <span>Products</span>
                  {openMenu === 'products' ? <FiChevronDown /> : <FiChevronRight />}
                </div>
                {openMenu === 'products' && (
                  <div className="nav-children">
                    <Link href="/admin/products" legacyBehavior><a>All Products</a></Link>
                    
                    <Link href="/admin/categories" legacyBehavior><a>Products Category</a></Link>
                  </div>
                )}
              </div>

              {/* Orders Section */}
              <div>
                <div
                  className="nav-parent"
                  onClick={() => toggleMenu('orders')}
                >
                  <span>Orders</span>
                  {openMenu === 'orders' ? <FiChevronDown /> : <FiChevronRight />}
                </div>
                {openMenu === 'orders' && (
                  <div className="nav-children">
                    <Link href="/admin/orders" legacyBehavior><a>All Orders</a></Link>
                    <Link href="/admin/orders/reports" legacyBehavior><a>Reports</a></Link>
                  </div>
                )}
              </div>

              {/* Users Section */}
              <div>
                <div
                  className="nav-parent"
                  onClick={() => toggleMenu('users')}
                >
                  <span>Users</span>
                  {openMenu === 'users' ? <FiChevronDown /> : <FiChevronRight />}
                </div>
                {openMenu === 'users' && (
                  <div className="nav-children">
                    <Link href="/admin/users" legacyBehavior><a>All Users</a></Link>
                    <Link href="/admin/roles" legacyBehavior><a>Roles & Permissions</a></Link>
                  </div>
                )}
              </div>

              {/* Blogs */}
              <div>
                <div
                  className="nav-parent"
                  onClick={() => toggleMenu('blogs')}
                >
                  <span>Blogs</span>
                  {openMenu === 'blogs' ? <FiChevronDown /> : <FiChevronRight />}
                </div>
                {openMenu === 'blogs' && (
                  <div className="nav-children">
                    <Link href="/admin/blogs" legacyBehavior><a>All Blogs</a></Link>
                    <Link href="/admin/blogs/new" legacyBehavior><a>Add Blog</a></Link>
                  </div>
                )}
              </div>

              {/* Profile */}
              <Link href="/admin/profile" legacyBehavior><a>Profile</a></Link>
            </nav>
          </aside>

          <main className="panel">{children}</main>
        </div>
      ) : (
        <main
          className="panel"
          style={{
            maxWidth: 980,
            margin: '136px auto',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {children}
        </main>
      )}

      <style jsx>{`
        .nav-parent {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 10px;
          border-radius: 6px;
          cursor: pointer;
          margin-bottom: 6px;
          color: var(--muted);
        }
        .nav-parent:hover {
          background: rgba(0,0,0,0.04);
          color: var(--accent);
        }
        .nav-children {
          padding-left: 12px;
          display: flex;
          flex-direction: column;
          margin-bottom: 8px;
        }
        .nav-children a {
          padding: 6px 10px;
          margin: 2px 0;
          border-radius: 6px;
          color: var(--muted);
        }
        .nav-children a:hover {
          background: rgba(0,0,0,0.04);
          color: var(--accent);
        }
      `}</style>
    </div>
  );
}
