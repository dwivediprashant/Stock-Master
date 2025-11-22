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

  if (loading) return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}}></div></div>;

  return (
    <div className="container-fluid p-5">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="h3 fw-bold mb-2">Dashboard</h1>
          <p className="text-muted mb-0 fs-5">Welcome back! Here's what's happening with your inventory.</p>
        </div>
        <div className="d-flex gap-3">
            <button className="btn btn-white border shadow-sm px-4 py-2"><i className="bi bi-download me-2"></i>Export Report</button>
            <button className="btn btn-primary px-4 py-2"><i className="bi bi-plus-lg me-2"></i>New Operation</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-5 mb-5">
        <div className="col-md-4">
          <div className="dashboard-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-start h-100">
              <div className="d-flex flex-column justify-content-between h-100">
                <div>
                    <p className="text-muted fw-medium mb-2 text-uppercase small ls-1">Total Products</p>
                    <h2 className="display-5 fw-bold mb-0">{stats.totalProducts}</h2>
                </div>
                <p className="text-success small mt-3 mb-0"><i className="bi bi-arrow-up-short fs-5 align-middle"></i> <span className="fw-semibold">12%</span> vs last month</p>
              </div>
              <div className="stat-icon-wrapper stat-icon-primary p-3 rounded-4">
                <i className="bi bi-box-seam fs-3"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="dashboard-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-start h-100">
              <div className="d-flex flex-column justify-content-between h-100">
                <div>
                    <p className="text-muted fw-medium mb-2 text-uppercase small ls-1">Total Stock Value</p>
                    <h2 className="display-5 fw-bold mb-0">${stats.totalValue.toLocaleString()}</h2>
                </div>
                <p className="text-success small mt-3 mb-0"><i className="bi bi-arrow-up-short fs-5 align-middle"></i> <span className="fw-semibold">5%</span> vs last month</p>
              </div>
              <div className="stat-icon-wrapper stat-icon-success p-3 rounded-4">
                <i className="bi bi-currency-dollar fs-3"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="dashboard-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-start h-100">
              <div className="d-flex flex-column justify-content-between h-100">
                <div>
                    <p className="text-muted fw-medium mb-2 text-uppercase small ls-1">Low Stock Alerts</p>
                    <h2 className="display-5 fw-bold mb-0">{stats.lowStockCount}</h2>
                </div>
                <p className="text-danger small mt-3 mb-0"><i className="bi bi-exclamation-circle fs-5 align-middle"></i> Needs attention</p>
              </div>
              <div className="stat-icon-wrapper stat-icon-danger p-3 rounded-4">
                <i className="bi bi-bell fs-3"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-5">
        {/* Recent Activity Table */}
        <div className="col-lg-8">
          <div className="table-card h-100 border-0 shadow-sm">
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom bg-white rounded-top-3">
              <h5 className="fw-bold mb-0">Recent Activity</h5>
              <button className="btn btn-sm btn-link text-decoration-none fw-medium" onClick={() => navigate('/ledger')}>View All</button>
            </div>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-4 py-3 text-secondary fw-semibold small">Reference</th>
                    <th className="py-3 text-secondary fw-semibold small">Product</th>
                    <th className="py-3 text-secondary fw-semibold small">Date</th>
                    <th className="py-3 text-secondary fw-semibold small">Type</th>
                    <th className="text-end pe-4 py-3 text-secondary fw-semibold small">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentActivity.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-5 text-muted">
                        <div className="py-5">
                            <i className="bi bi-inbox display-4 d-block mb-3 text-light opacity-25"></i>
                            <p className="mb-0">No recent activity found.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    stats.recentActivity.map((move) => (
                      <tr key={move._id}>
                        <td className="ps-4 py-3 fw-medium text-primary">{move.reference}</td>
                        <td className="py-3 fw-medium text-dark">{move.product?.name}</td>
                        <td className="py-3 text-muted small">{new Date(move.createdAt).toLocaleDateString()}</td>
                        <td className="py-3">
                            {move.quantity > 0 ? 
                                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3">Incoming</span> : 
                                <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill px-3">Outgoing</span>
                            }
                        </td>
                        <td className={`text-end pe-4 py-3 fw-bold ${move.quantity > 0 ? 'text-success' : 'text-danger'}`}>
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
          <div className="dashboard-card h-100 border-0 shadow-sm">
            <div className="p-4 border-bottom bg-white rounded-top-3">
              <h5 className="fw-bold mb-0">Quick Actions</h5>
            </div>
            <div className="p-4">
              <div className="d-flex flex-column gap-3">
                <button onClick={() => navigate("/operations/receipts/new")} className="quick-action-btn p-3 border rounded-3 bg-light-subtle hover-lift transition-all">
                  <i className="bi bi-box-arrow-in-down fs-4 text-primary bg-primary-subtle p-2 rounded-3 me-3"></i>
                  <div>
                    <div className="fw-bold text-dark">Receive Products</div>
                    <div className="small text-muted mt-1">Register incoming stock</div>
                  </div>
                </button>
                
                <button onClick={() => navigate("/operations/deliveries/new")} className="quick-action-btn p-3 border rounded-3 bg-light-subtle hover-lift transition-all">
                  <i className="bi bi-truck fs-4 text-info bg-info-subtle p-2 rounded-3 me-3"></i>
                  <div>
                    <div className="fw-bold text-dark">Create Delivery</div>
                    <div className="small text-muted mt-1">Ship products to customers</div>
                  </div>
                </button>

                <button onClick={() => navigate("/products/new")} className="quick-action-btn p-3 border rounded-3 bg-light-subtle hover-lift transition-all">
                  <i className="bi bi-plus-square fs-4 text-success bg-success-subtle p-2 rounded-3 me-3"></i>
                  <div>
                    <div className="fw-bold text-dark">Add Product</div>
                    <div className="small text-muted mt-1">Create a new item SKU</div>
                  </div>
                </button>

                <button onClick={() => navigate("/operations/adjustments/new")} className="quick-action-btn p-3 border rounded-3 bg-light-subtle hover-lift transition-all">
                  <i className="bi bi-sliders fs-4 text-warning bg-warning-subtle p-2 rounded-3 me-3"></i>
                  <div>
                    <div className="fw-bold text-dark">Inventory Adjustment</div>
                    <div className="small text-muted mt-1">Correct stock discrepancies</div>
                  </div>
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
