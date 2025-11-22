import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOperations } from "./api";

const AdjustmentList = () => {
  const [adjustments, setAdjustments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdjustments();
  }, []);

  const fetchAdjustments = async () => {
    try {
      const data = await getOperations("adjustment");
      setAdjustments(data);
    } catch (error) {
      console.error("Failed to fetch adjustments", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "draft": return "bg-info text-dark";
      case "done": return "bg-success";
      case "canceled": return "bg-danger";
      default: return "bg-secondary";
    }
  };

  if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container-fluid p-4">
      <div className="page-header">
        <h1 className="h3">Inventory Adjustments</h1>
        <button
          onClick={() => navigate("/operations/adjustments/new")}
          className="btn btn-primary"
        >
          <i className="bi bi-plus-lg me-2"></i>Create Adjustment
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Reference</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {adjustments.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-5 text-muted">
                      <i className="bi bi-clipboard-check display-4 d-block mb-3"></i>
                      No adjustments found.
                    </td>
                  </tr>
                ) : (
                  adjustments.map((adjustment) => (
                    <tr key={adjustment._id} onClick={() => navigate(`/operations/adjustments/${adjustment._id}`)} style={{ cursor: "pointer" }}>
                      <td className="ps-4 fw-bold text-primary">{adjustment.reference}</td>
                      <td>{new Date(adjustment.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(adjustment.status)}`}>
                          {adjustment.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <i className="bi bi-chevron-right text-muted"></i>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdjustmentList;
