import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOperations } from "./api";

const ReceiptList = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      const data = await getOperations("receipt");
      setReceipts(data);
    } catch (error) {
      console.error("Failed to fetch receipts", error);
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

  // Filter receipts based on search term
  const filteredReceipts = receipts.filter((receipt) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      receipt.reference.toLowerCase().includes(searchLower) ||
      (receipt.partner && receipt.partner.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="container-fluid p-4">
      <div className="page-header">
        <h1 className="h3">Receipts (Incoming)</h1>
        <button
          onClick={() => navigate("/operations/receipts/new")}
          className="btn btn-primary"
        >
          <i className="bi bi-plus-lg me-2"></i>Create Receipt
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-3">
        <div className="input-group">
          <span className="input-group-text bg-white">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search by reference or contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="btn btn-outline-secondary"
              onClick={() => setSearchTerm("")}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Reference</th>
                  <th>Vendor</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReceipts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      <i className="bi bi-truck display-4 d-block mb-3"></i>
                      {searchTerm ? "No receipts match your search." : "No receipts found."}
                    </td>
                  </tr>
                ) : (
                  filteredReceipts.map((receipt) => (
                    <tr key={receipt._id} onClick={() => navigate(`/operations/receipts/${receipt._id}`)} style={{ cursor: "pointer" }}>
                      <td className="ps-4 fw-bold text-primary">{receipt.reference}</td>
                      <td>{receipt.partner || "-"}</td>
                      <td>{new Date(receipt.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(receipt.status)}`}>
                          {receipt.status.toUpperCase()}
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

export default ReceiptList;
