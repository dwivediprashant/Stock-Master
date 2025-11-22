import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOperations } from "./api";

const TransferList = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      const data = await getOperations("internal");
      setTransfers(data);
    } catch (error) {
      console.error("Failed to fetch transfers", error);
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
        <h1 className="h3">Internal Transfers</h1>
        <button
          onClick={() => navigate("/operations/transfers/new")}
          className="btn btn-primary"
        >
          <i className="bi bi-plus-lg me-2"></i>Create Transfer
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Reference</th>
                  <th>Source</th>
                  <th>Destination</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {transfers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <i className="bi bi-arrow-left-right display-4 d-block mb-3"></i>
                      No internal transfers found.
                    </td>
                  </tr>
                ) : (
                  transfers.map((transfer) => (
                    <tr key={transfer._id} onClick={() => navigate(`/operations/transfers/${transfer._id}`)} style={{ cursor: "pointer" }}>
                      <td className="ps-4 fw-bold text-primary">{transfer.reference}</td>
                      <td>{transfer.sourceLocation}</td>
                      <td>{transfer.destinationLocation}</td>
                      <td>{new Date(transfer.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(transfer.status)}`}>
                          {transfer.status.toUpperCase()}
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

export default TransferList;
