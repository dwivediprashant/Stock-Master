import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOperations } from "./api";

const DeliveryList = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const data = await getOperations("delivery");
      setDeliveries(data);
    } catch (error) {
      console.error("Failed to fetch deliveries", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "draft": return "bg-info text-dark";
      case "waiting": return "bg-warning text-dark";
      case "ready": return "bg-primary";
      case "done": return "bg-success";
      case "canceled": return "bg-danger";
      default: return "bg-secondary";
    }
  };

  if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>;

  // Filter deliveries based on search term
  const filteredDeliveries = deliveries.filter((delivery) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      delivery.reference.toLowerCase().includes(searchLower) ||
      (delivery.partner && delivery.partner.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="container-fluid p-4">
      <div className="page-header">
        <h1 className="h3">Delivery Orders (Outgoing)</h1>
        <button
          onClick={() => navigate("/operations/deliveries/new")}
          className="btn btn-primary"
        >
          <i className="bi bi-plus-lg me-2"></i>Create Delivery
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
            placeholder="Search by reference or customer..."
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
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      <i className="bi bi-truck-flatbed display-4 d-block mb-3"></i>
                      {searchTerm ? "No deliveries match your search." : "No delivery orders found."}
                    </td>
                  </tr>
                ) : (
                  filteredDeliveries.map((delivery) => (
                    <tr key={delivery._id} onClick={() => navigate(`/operations/deliveries/${delivery._id}`)} style={{ cursor: "pointer" }}>
                      <td className="ps-4 fw-bold text-primary">{delivery.reference}</td>
                      <td>{delivery.partner || "-"}</td>
                      <td>{new Date(delivery.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(delivery.status)}`}>
                          {delivery.status.toUpperCase()}
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

export default DeliveryList;
