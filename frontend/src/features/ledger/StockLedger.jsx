import { useState, useEffect } from "react";
import { getStockMoves } from "./api";

const StockLedger = () => {
  const [moves, setMoves] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="container-fluid p-4">
      <div className="page-header mb-4">
        <h1 className="h3">Stock Ledger (Moves History)</h1>
        <p className="text-muted">Complete history of all stock movements.</p>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Date</th>
                  <th>Reference</th>
                  <th>Product</th>
                  <th>From</th>
                  <th>To</th>
                  <th className="text-end">Quantity</th>
                  <th className="text-end pe-4">Balance</th>
                </tr>
              </thead>
              <tbody>
                {moves.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      <i className="bi bi-journal-text display-4 d-block mb-3"></i>
                      No stock moves recorded yet.
                    </td>
                  </tr>
                ) : (
                  moves.map((move) => (
                    <tr key={move._id}>
                      <td className="ps-4 text-muted" style={{ fontSize: '0.9rem' }}>
                        {new Date(move.createdAt).toLocaleString()}
                      </td>
                      <td className="fw-bold text-primary" style={{ fontSize: '0.9rem' }}>
                        {move.reference}
                      </td>
                      <td>
                        <span className="fw-medium">{move.product?.name}</span>
                        <br />
                        <small className="text-muted">{move.product?.sku}</small>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">{move.locationFrom}</span>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">{move.locationTo}</span>
                      </td>
                      <td className={`text-end fw-bold ${move.quantity > 0 ? 'text-success' : 'text-danger'}`}>
                        {move.quantity > 0 ? '+' : ''}{move.quantity}
                      </td>
                      <td className="text-end pe-4 text-muted">
                        {move.balanceAfter}
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

export default StockLedger;
