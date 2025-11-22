import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { APP_LOGO_URL } from "../config/branding";

const navLinkClass = ({ isActive }) =>
  isActive ? "nav-link nav-link-active" : "nav-link";

const MainLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img
              src={APP_LOGO_URL}
              alt="StockMaster logo"
              className="sidebar-logo-img"
            />
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Overview</div>
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Products</div>
            <NavLink to="/products" className={navLinkClass}>
              Products
            </NavLink>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Operations</div>
            <NavLink to="/operations/receipts" className={navLinkClass}>
              Receipts
            </NavLink>
            <NavLink to="/operations/deliveries" className={navLinkClass}>
              Delivery Orders
            </NavLink>
            <NavLink to="/operations/transfers" className={navLinkClass}>
              Internal Transfers
            </NavLink>
            <NavLink to="/operations/adjustments" className={navLinkClass}>
              Inventory Adjustments
            </NavLink>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">History</div>
            <NavLink to="/ledger" className={navLinkClass}>
              Move History
            </NavLink>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Settings</div>
            <NavLink to="/settings/warehouses" className={navLinkClass}>
              Warehouses & Locations
            </NavLink>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Profile</div>
            <NavLink to="/profile" className={navLinkClass}>
              My Profile
            </NavLink>
            <button
              type="button"
              className="nav-link nav-link-button"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="user-avatar">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="user-meta">
              <div className="user-name">{user?.name || "User"}</div>
              <div className="user-role">{user?.role || "staff"}</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
