import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "./api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStockCount: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container-fluid p-4">
      <div className="page-header mb-4">
        <h1 className="h3">Dashboard</h1>
        <p className="text-muted">Overview of your inventory status.</p>
      </div>

      {/* KPI Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                <i className="bi bi-box-seam text-primary fs-4"></i>
              </div>
              <div>
                <h6 className="card-subtitle text-muted mb-1">Total Products</h6>
                <h2 className="card-title mb-0">{stats.totalProducts}</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center">
              <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                <i className="bi bi-currency-dollar text-success fs-4"></i>
              </div>
              <div>
                <h6 className="card-subtitle text-muted mb-1">Total Stock Value</h6>
                <h2 className="card-title mb-0">${stats.totalValue.toLocaleString()}</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center">
              <div className="bg-danger bg-opacity-10 p-3 rounded-circle me-3">
                <i className="bi bi-exclamation-triangle text-danger fs-4"></i>
              </div>
              <div>
                <h6 className="card-subtitle text-muted mb-1">Low Stock Alerts</h6>
                <h2 className="card-title mb-0">{stats.lowStockCount}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Recent Activity */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="card-title mb-0">Recent Activity</h5>
            </div>
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Date</th>
                    <th>Reference</th>
                    <th>Product</th>
                    <th>Action</th>
                    <th className="text-end pe-4">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentActivity.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">No recent activity.</td>
                    </tr>
                  ) : (
                    stats.recentActivity.map((move) => (
                      <tr key={move._id}>
                        <td className="ps-4 text-muted small">
                          {new Date(move.createdAt).toLocaleDateString()}
                        </td>
                        <td className="fw-medium text-primary small">{move.reference}</td>
                        <td>{move.product?.name}</td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {move.quantity > 0 ? "IN" : "OUT"}
                          </span>
                        </td>
                        <td className={`text-end pe-4 fw-bold ${move.quantity > 0 ? 'text-success' : 'text-danger'}`}>
                          {move.quantity > 0 ? '+' : ''}{move.quantity}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="card-title mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-3">
                <button onClick={() => navigate("/operations/receipts/new")} className="btn btn-outline-primary text-start p-3">
                  <i className="bi bi-box-arrow-in-down me-2"></i> Receive Products
                </button>
                <button onClick={() => navigate("/operations/deliveries/new")} className="btn btn-outline-primary text-start p-3">
                  <i className="bi bi-box-arrow-up me-2"></i> Create Delivery
                </button>
                <button onClick={() => navigate("/products/new")} className="btn btn-outline-secondary text-start p-3">
                  <i className="bi bi-plus-circle me-2"></i> Add New Product
                </button>
                <button onClick={() => navigate("/operations/adjustments/new")} className="btn btn-outline-secondary text-start p-3">
                  <i className="bi bi-sliders me-2"></i> Adjust Inventory
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
