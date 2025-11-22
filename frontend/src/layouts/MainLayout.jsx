import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { APP_LOGO_URL } from "../config/branding";

const MainLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <aside className="sidebar d-flex flex-column flex-shrink-0 p-3 text-white" style={{ width: "280px" }}>
        <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
          <img
            src={APP_LOGO_URL}
            alt="StockMaster"
            height="32"
            className="me-2 rounded"
          />
          <span className="fs-4 fw-bold">StockMaster</span>
        </a>
        <hr className="border-secondary" />
        
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item mb-1">
            <NavLink to="/dashboard" className="nav-link text-white">
              <i className="bi bi-speedometer2 me-2"></i>
              Dashboard
            </NavLink>
          </li>
          
          <li className="nav-item mb-1">
            <NavLink to="/products" className="nav-link text-white">
              <i className="bi bi-box-seam me-2"></i>
              Products
            </NavLink>
          </li>

          <li className="nav-header text-uppercase text-light fw-bold mt-3 mb-2 ps-3" style={{ fontSize: '0.75rem', letterSpacing: '1px', opacity: 0.9 }}>
            Operations
          </li>
          
          <li className="nav-item mb-1">
            <NavLink to="/operations/receipts" className="nav-link text-white">
              <i className="bi bi-arrow-down-circle me-2"></i>
              Receipts
            </NavLink>
          </li>
          <li className="nav-item mb-1">
            <NavLink to="/operations/deliveries" className="nav-link text-white">
              <i className="bi bi-arrow-up-circle me-2"></i>
              Delivery Orders
            </NavLink>
          </li>
          <li className="nav-item mb-1">
            <NavLink to="/operations/transfers" className="nav-link text-white">
              <i className="bi bi-arrow-left-right me-2"></i>
              Internal Transfers
            </NavLink>
          </li>
          <li className="nav-item mb-1">
            <NavLink to="/operations/adjustments" className="nav-link text-white">
              <i className="bi bi-sliders me-2"></i>
              Adjustments
            </NavLink>
          </li>

          <li className="nav-header text-uppercase text-light fw-bold mt-3 mb-2 ps-3" style={{ fontSize: '0.75rem', letterSpacing: '1px', opacity: 0.9 }}>
            Reporting
          </li>

          <li className="nav-item mb-1">
            <NavLink to="/ledger" className="nav-link text-white">
              <i className="bi bi-journal-text me-2"></i>
              Move History
            </NavLink>
          </li>

          <li className="nav-header text-uppercase text-light fw-bold mt-3 mb-2 ps-3" style={{ fontSize: '0.75rem', letterSpacing: '1px', opacity: 0.9 }}>
            Settings
          </li>

          <li className="nav-item mb-1">
            <NavLink to="/settings/warehouses" className="nav-link text-white">
              <i className="bi bi-building me-2"></i>
              Warehouses
            </NavLink>
          </li>
        </ul>
        
        <hr className="border-secondary" />
        
        <div className="dropdown">
          <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
            <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <strong>{user?.name || "User"}</strong>
          </a>
          <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
            <li><NavLink className="dropdown-item" to="/profile">Profile</NavLink></li>
            <li><hr className="dropdown-divider" /></li>
            <li><button className="dropdown-item" onClick={logout}>Sign out</button></li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 overflow-auto" style={{ height: "100vh", backgroundColor: "var(--cool-gray-bg)" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
