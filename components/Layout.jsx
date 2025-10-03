// components/Layout.jsx
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "./AuthProvider";
import { toast } from "react-toastify";
import { useEffect, useMemo, useState } from "react";
import {
  FiMenu,
  FiMessageSquare,
  FiBox,
  FiLayers,
  FiDollarSign,
  FiGift,
  FiBell,
  FiUser,
  FiChevronDown,
  FiChevronRight,
  FiLogOut,
  FiHome,
} from "react-icons/fi";

export default function Layout({
  children,
  title = "Dashboard",
  showSidebar = true,
  showHeader = true,
  showFooter = false,
}) {
  const { user, logout } = useAuth();
  const router = useRouter();

  // unified sidebar control
  const [sideOpen, setSideOpen] = useState(true);      // desktop open/close (and mobile drawer)
  const [collapsed, setCollapsed] = useState(false);   // desktop mini mode (72px)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 991.98px)");
    const onChange = () => {
      setIsMobile(mq.matches);
      // on mobile default closed; on desktop default open
      setSideOpen(!mq.matches);
      setCollapsed(false);
    };
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // lock scroll when mobile drawer open
  useEffect(() => {
    if (isMobile && sideOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [isMobile, sideOpen]);

  const handleLogout = () => {
    logout?.();
    toast.success("Logged out");
  };

  // ---- Nav data with children ----
  const navTree = useMemo(
    () => [
      { href: "/admin", label: "Dashboard", icon: <FiHome /> },

      {
        key: "products",
        href: "/admin/products",
        label: "Products",
        icon: <FiBox />,
        children: [
          { href: "/admin/products", label: "All Products", icon: <FiBox /> },
          { href: "/admin/products/categories", label: "Categories", icon: <FiLayers /> },
          { href: "/admin/products/variants", label: "Variant", icon: <FiBox /> },
          { href: "/admin/products/inventory", label: "Inventory", icon: <FiBox /> },
          { href: "/admin/products/reviews", label: "Reviews", icon: <FiBox /> },
          { href: "/admin/products/sale", label: "Sale", icon: <FiDollarSign /> },
        ],
      },

      { href: "/admin/orders", label: "Orders", icon: <FiGift /> },
      { href: "/admin/coupons", label: "Coupons", icon: <FiGift /> },
      { href: "/admin/profile", label: "My Profile", icon: <FiUser /> },
    ],
    []
  );

  // ---- Active helpers ----
  const path = router.asPath || router.pathname || "";

  const isActive = (href) => {
    if (!href) return false;
    if (href === "/admin") return path === "/admin";
    return path.startsWith(href);
  };

  const isAnyChildActive = (node) =>
    (node.children || []).some((c) => isActive(c.href));

  // ---- Open state for parents ----
  const [openMenus, setOpenMenus] = useState({}); // { [key]: boolean }

  // Auto-open parent if child active
  useEffect(() => {
    const next = {};
    navTree.forEach((n) => {
      if (n.children?.length) {
        const k = n.key || n.href;
        next[k] = isAnyChildActive(n) || isActive(n.href);
      }
    });
    setOpenMenus((prev) => ({ ...prev, ...next }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  const toggleMenu = (key) => {
    setOpenMenus((s) => ({ ...s, [key]: !s[key] }));
  };

  return (
    <div className={`wrap ${showSidebar ? "with-side" : ""}`}>
      {/* Top Navbar */}
      {showHeader && (
        <header className="topbar">
          <div className="left">
            {showSidebar && (
              <button
                className="iconbtn"
                aria-label="Menu"
                onClick={() => {
                  if (isMobile) setSideOpen(true);
                  else setCollapsed((v) => !v);
                }}
              >
                <FiMenu />
              </button>
            )}
            <div className="brand">
              <span className="logo">
                <img src="https://frontend.shreevajewels.com/images/logo/logo-rec.png" alt="logo" />
              </span>
            </div>
          </div>

          <div className="right">
            <button className="iconbtn">
              <FiMessageSquare />
            </button>
            <button className="iconbtn with-dot">
              <FiBell />
              <span className="dot" />
            </button>
            <div className="profile">
              <img src="https://i.pravatar.cc/40" alt="avatar" className="avatar" />
              <span className="name">{user?.name || "Super Admin"}</span>
              <FiChevronDown />
            </div>
          </div>
        </header>
      )}

      {/* Sidebar */}
      {showSidebar && (
        <>
          <aside
            className={`sidebar text-white ${sideOpen ? "open" : ""} ${collapsed ? "collapsed" : ""}`}
          >
            <div className="sideInner">
              <nav className="nav">
                {navTree.map((n) => {
                  // Leaf item
                  if (!n.children?.length) {
                    const active = isActive(n.href);
                    return (
                      <Link
                        key={n.href}
                        href={n.href}
                        className={`navItem ${active ? "active" : ""}`}
                        data-active={active || undefined}
                        data-title={collapsed ? n.label : undefined}
                        aria-current={active ? "page" : undefined}
                        onClick={() => isMobile && setSideOpen(false)}
                      >
                        <span className="ico">{n.icon}</span>
                        <span className="text text-white ms-3">{n.label}</span>
                      </Link>
                    );
                  }

                  // Parent with children
                  const k = n.key || n.href;
                  const parentActive = isActive(n.href) || isAnyChildActive(n);
                  const open = !!openMenus[k];

                  const ParentButton = (
                    <button
                      type="button"
                      className={`navItem ${parentActive ? "active" : ""}`}
                      data-active={parentActive || undefined}
                      data-title={collapsed ? n.label : undefined}
                      aria-expanded={open}
                      onClick={() => {
                        if (collapsed) {
                          // In collapsed desktop, toggle flyout
                          toggleMenu(k);
                        } else {
                          // In normal width or mobile, toggle accordion
                          toggleMenu(k);
                        }
                      }}
                    >
                      <span className="ico">{n.icon}</span>
                      <span className="text text-white ms-3">{n.label}</span>
                      <span className={`chev ${open ? "rot" : ""}`}>
                        <FiChevronRight />
                      </span>
                    </button>
                  );

                  return (
                    <div key={k} className={`menuBlock ${open ? "open" : ""}`}>
                      {collapsed ? (
                        // Collapsed: keep button, show flyout on open
                        <div className="parentWrap">{ParentButton}</div>
                      ) : (
                        ParentButton
                      )}

                      {/* Children */}
                      <div
                        className={`subNav ${open ? "open" : ""} ${
                          collapsed ? "fly" : ""
                        }`}
                      >
                        {(n.children || []).map((c) => {
                          const active = isActive(c.href);
                          return (
                            <Link
                              key={c.href}
                              href={c.href}
                              className={`subItem ${active ? "active" : ""}`}
                              data-active={active || undefined}
                              onClick={() => {
                                if (isMobile) setSideOpen(false);
                              }}
                            >
                              <span className="dot" />
                              <span className="lbl">{c.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                <hr className="sep" />

                <button className="navItem danger" onClick={handleLogout}>
                  <span className="ico">
                    <FiLogOut />
                  </span>
                  <span className="text">Log Out</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Mobile overlay */}
          {isMobile && sideOpen && <div className="overlay" onClick={() => setSideOpen(false)} />}
        </>
      )}

      {/* Main */}
      <main className="main">
        <div className="pageTitle">{title}</div>
        {children}
      </main>

      {showFooter && (
        <footer className="footer">
          © {new Date().getFullYear()} Shreeva Jewels — Built by Blazync
        </footer>
      )}

      <style jsx>{`
        :global(html, body) {
          background: #f6f7fb;
        }
        .logo img {
          width: 200px;
          height: 50px;
          object-fit: contain;
        }
        .wrap {
          min-height: 100vh;
          display: grid;
          grid-template-rows: 64px 1fr auto;
          grid-template-columns: 1fr;
        }
        .with-side {
          grid-template-columns: 1fr;
        }

        /* Topbar */
        .topbar {
          position: sticky;
          top: 0;
          z-index: 50;
          height: 64px;
          background: #ffffff;
          border-bottom: 1px solid #ececf3;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          gap: 12px;
        }
        .left { display: flex; align-items: center; gap: 12px; flex: 1; }
        .right { display: flex; align-items: center; gap: 8px; }
        .brand { display: flex; align-items: center; gap: 8px; min-width: 120px; }
        .logo { font-weight: 800; font-size: 22px; color: #111827; }

        .iconbtn {
          width: 36px; height: 36px; border: none; border-radius: 10px;
          background: #f3f4f6; display: inline-flex; align-items: center; justify-content: center; cursor: pointer;
        }
        .iconbtn.with-dot { position: relative; }
        .iconbtn.with-dot .dot {
          position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; background: #ef4444; border-radius: 999px;
        }

        .profile { display: inline-flex; align-items: center; gap: 8px; padding: 4px 8px; background: #f3f4f6; border-radius: 999px; }
        .avatar { width: 28px; height: 28px; border-radius: 999px; object-fit: cover; }
        .name { font-weight: 600; }

        /* Sidebar */
        .sidebar {
          position: fixed; top: 64px; bottom: 0; left: 0;
          width: 264px; background: #0b1020; color: #e7eaf3;
          border-right: 1px solid rgba(255,255,255,.06);
          box-shadow: 0 8px 24px rgba(2,6,23,.25);
          transform: translateX(-100%);
          transition: transform .25s ease, width .2s ease;
          z-index: 40;
        }
        .sidebar.open { transform: translateX(0); }
        @media (min-width: 992px) { .sidebar { transform: none; } }
        .sidebar.collapsed { width: 72px; }

        .sideInner { height: 100%; overflow: auto; padding: 12px 10px; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.22) transparent; }
        .sideInner::-webkit-scrollbar { width: 8px; }
        .sideInner::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(255,255,255,.22), rgba(255,255,255,.1));
          border-radius: 999px;
        }

        .nav { display: flex; flex-direction: column; gap: 6px; }

        .navItem{
          --bg: transparent; --fg: #e7eaf3;
          display: grid; grid-template-columns: 24px 1fr auto;
          align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 12px; color: #fff; text-decoration: none;
          background: var(--bg); border: 1px solid transparent; outline: none; cursor: pointer;
          transition: background .15s ease, color .15s ease, border-color .15s ease, transform .05s ease;
        }
        .navItem:hover{ --bg: rgba(255,255,255,.06); }
        .navItem:active{ transform: translateY(1px); }
        .navItem .ico :global(svg){ width: 20px; height: 20px; opacity: .92; }
        .navItem .text{ white-space: nowrap; overflow: hidden; text-overflow: ellipsis; letter-spacing: .2px; }
        .navItem .chev :global(svg){ transition: transform .15s ease; }
        .navItem .chev.rot :global(svg){ transform: rotate(90deg); }

        .sidebar .text{ white-space: nowrap; overflow: hidden; text-overflow: ellipsis; letter-spacing: .2px; margin-left: 20px; }
        .navItem .ico{ color:#fff !important; }

        .badge{ justify-self: end; min-width: 18px; padding: 2px 6px; font-size: 11px; line-height: 1; color: #0b1020; background: #f43f5e; border-radius: 999px; box-shadow: 0 0 0 1px rgba(255,255,255,.2) inset; }

        /* active state */
        .navItem.active,
        .navItem[data-active="true"]{
          --bg: rgba(250,250,255,.14);
          --fg: #ffffff;
          border-color: rgba(255,255,255,.18);
          box-shadow: 0 0 0 2px rgba(255,255,255,.06) inset;
        }

        /* Sub menu */
        .menuBlock { position: relative; }
        .subNav {
          display: grid;
          gap: 6px;
          margin: 6px 0 0 40px;     /* indent under parent */
          padding: 4px 0 4px 6px;
          border-left: 1px dashed rgba(255,255,255,.15);
          max-height: 0;
          overflow: hidden;
          transition: max-height .2s ease;
        }
        .subNav.open { max-height: 400px; } /* accordion height */

        .subItem{
          display: grid;
          grid-template-columns: 10px 1fr;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 10px;
          color: #e7eaf3;
          text-decoration: none;
          background: transparent;
          transition: background .15s ease;
        }
        .subItem:hover{ background: rgba(255,255,255,.06); }
        .subItem .dot{
          width: 6px; height: 6px; border-radius: 999px; background: rgba(255,255,255,.55);
          display: inline-block;
        }
        .subItem.active,
        .subItem[data-active="true"]{
          background: rgba(250,250,255,.14);
          box-shadow: 0 0 0 2px rgba(255,255,255,.06) inset;
        }

        /* Collapsed → flyout */
        .subNav.fly{
          position: absolute;
          left: 72px; top: 0;
          margin: 0; padding: 8px;
          width: 220px;
          background: #0b1020;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(2,6,23,.35);
          max-height: none;   /* no clip */
          display: none;      /* show only when parent open */
        }
        .menuBlock.open .subNav.fly{ display: grid; }

        /* danger (logout) */
        .navItem.danger{ color: #fecaca; }
        .navItem.danger:hover{ --bg: rgba(239,68,68,.18); color: #fff; }

        .sep{ border: none; height: 1px; margin: 10px 4px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.08), transparent); }

        .sidebar.collapsed .text,
        .sidebar.collapsed .badge{ display: none; }
        .sidebar.collapsed .navItem{
          grid-template-columns: 1fr;
          justify-items: center;
          padding: 12px 8px;
        }

        .overlay{ position: fixed; inset: 64px 0 0 0; background: rgba(0,0,0,.4); z-index: 35; }

        /* Main */
        .main { padding: 20px; }
        @media (min-width: 992px) {
          .main { margin-left: ${showSidebar ? "260px" : "0"}; }
          .sidebar.collapsed ~ .main { margin-left: ${showSidebar ? "72px" : "0"}; }
        }
        .pageTitle { font-size: 28px; font-weight: 800; color: #111827; margin-bottom: 16px; }

        .footer { padding: 14px; text-align: center; color: #6b7280; }
      `}</style>
    </div>
  );
}
