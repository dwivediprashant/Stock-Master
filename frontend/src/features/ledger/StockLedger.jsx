import { useState, useEffect } from "react";
import { getStockMoves } from "./api";

const StockLedger = () => {
  const [moves, setMoves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMoves();
  }, []);

  const fetchMoves = async () => {
    try {
      const data = await getStockMoves();
      setMoves(data);
    } catch (error) {
      console.error("Failed to fetch stock ledger", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>;

  // Filter moves based on search term
  const filteredMoves = moves.filter((move) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      move.reference.toLowerCase().includes(searchLower) ||
      (move.product?.name && move.product.name.toLowerCase().includes(searchLower)) ||
      (move.locationFrom && move.locationFrom.toLowerCase().includes(searchLower)) ||
      (move.locationTo && move.locationTo.toLowerCase().includes(searchLower))
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "done": return "bg-success";
      case "ready": return "bg-primary";
      case "draft": return "bg-info text-dark";
      default: return "bg-secondary";
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="page-header mb-4">
        <h1 className="h3">Move History</h1>
        <p className="text-muted">By default land on List View</p>
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
            placeholder="Search by reference or contacts..."
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
                  <th>Date</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredMoves.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <i className="bi bi-journal-text display-4 d-block mb-3"></i>
                      {searchTerm ? "No moves match your search." : "No stock moves recorded yet."}
                    </td>
                  </tr>
                ) : (
                  filteredMoves.map((move) => (
                    <tr key={move._id}>
                      <td className="ps-4 fw-bold text-primary">
                        {move.reference}
                      </td>
                      <td className="text-muted">
                        {new Date(move.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {move.locationFrom || 'vendor'}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {move.locationTo || 'WH/Stock'}
                        </span>
                      </td>
                      <td className={`fw-bold ${move.quantity > 0 ? 'text-success' : 'text-danger'}`}>
                        {move.quantity > 0 ? '+' : ''}{move.quantity}
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadge(move.status || 'ready')}`}>
                          {(move.status || 'Ready').toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="alert alert-info mt-3">
        <i className="bi bi-info-circle me-2"></i>
        <strong>Note:</strong> Populate all moves done between the From-To locations in inventory. 
        Done on validation - each individual product display is done when validation is complete.
      </div>
    </div>
  );
};

export default StockLedger;
