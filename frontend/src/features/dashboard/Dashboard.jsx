import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOperations } from "../operations/api";

const Dashboard = () => {
  const [receipts, setReceipts] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [receiptsData, deliveriesData] = await Promise.all([
        getOperations("receipt"),
        getOperations("delivery"),
      ]);
      setReceipts(receiptsData);
      setDeliveries(deliveriesData);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const receiptStats = {
    toReceive: receipts.filter(r => r.status === 'draft').length,
    total: receipts.length,
  };

  const deliveryStats = {
    toDeliver: deliveries.filter(d => d.status === 'draft').length,
    late: deliveries.filter(d => d.status === 'late').length,
    waiting: deliveries.filter(d => d.status === 'waiting').length,
    total: deliveries.length,
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}}></div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="h3 fw-bold">Dashboard</h1>
      </div>

      {/* Operations Summary */}
      <div className="row g-4 mb-4">
        {/* Receipt Card */}
        <div className="col-md-6">
          <div 
            className="card border-2 shadow-sm h-100 cursor-pointer" 
            style={{ borderColor: '#e74c3c' }}
            onClick={() => navigate('/operations/receipts')}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5 className="fw-bold">Receipt</h5>
                <i className="bi bi-box-arrow-in-down fs-3 text-danger"></i>
              </div>
              
              <div className="mb-3">
                <div className="d-flex align-items-baseline">
                  <h2 className="display-4 fw-bold text-danger mb-0">{receiptStats.toReceive}</h2>
                  <span className="ms-2 text-muted">to Receive</span>
                </div>
              </div>

              <div className="d-flex gap-3 text-muted small">
                <div>
                  <i className="bi bi-check-circle me-1"></i>
                  {receiptStats.total} operations
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Card */}
        <div className="col-md-6">
          <div 
            className="card border-2 shadow-sm h-100 cursor-pointer" 
            style={{ borderColor: '#3498db' }}
            onClick={() => navigate('/operations/deliveries')}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5 className="fw-bold">Delivery</h5>
                <i className="bi bi-truck fs-3 text-primary"></i>
              </div>
              
              <div className="mb-3">
                <div className="d-flex align-items-baseline mb-2">
                  <h2 className="display-4 fw-bold text-primary mb-0">{deliveryStats.toDeliver}</h2>
                  <span className="ms-2 text-muted">to Deliver</span>
                </div>
                <div className="d-flex gap-3">
                  <span className="badge bg-danger">{deliveryStats.late} Late</span>
                  <span className="badge bg-warning text-dark">{deliveryStats.waiting} Waiting</span>
                </div>
              </div>

              <div className="d-flex gap-3 text-muted small">
                <div>
                  <i className="bi bi-check-circle me-1"></i>
                  {deliveryStats.total} operations
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row g-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Quick Actions</h5>
              <div className="row g-3">
                <div className="col-md-3">
                  <button 
                    onClick={() => navigate("/operations/receipts/new")} 
                    className="btn btn-outline-primary w-100 p-3 text-start"
                  >
                    <i className="bi bi-box-arrow-in-down me-2"></i>
                    <div className="fw-bold">New Receipt</div>
                  </button>
                </div>
                <div className="col-md-3">
                  <button 
                    onClick={() => navigate("/operations/deliveries/new")} 
                    className="btn btn-outline-info w-100 p-3 text-start"
                  >
                    <i className="bi bi-truck me-2"></i>
                    <div className="fw-bold">New Delivery</div>
                  </button>
                </div>
                <div className="col-md-3">
                  <button 
                    onClick={() => navigate("/products/new")} 
                    className="btn btn-outline-success w-100 p-3 text-start"
                  >
                    <i className="bi bi-plus-square me-2"></i>
                    <div className="fw-bold">Add Product</div>
                  </button>
                </div>
                <div className="col-md-3">
                  <button 
                    onClick={() => navigate("/ledger")} 
                    className="btn btn-outline-secondary w-100 p-3 text-start"
                  >

                    <i className="bi bi-journal-text me-2"></i>
                    <div className="fw-bold">Stock Ledger</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
