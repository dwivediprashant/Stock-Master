import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOperations } from "./api";
import KanbanColumn from "../../components/KanbanColumn";
import KanbanCard from "../../components/KanbanCard";

const DeliveryList = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'kanban'
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

  // Group by status for Kanban view
  const groupedDeliveries = {
    draft: filteredDeliveries.filter(d => d.status === 'draft'),
    done: filteredDeliveries.filter(d => d.status === 'done'),
  };

  return (
    <div className="container-fluid p-4">
      <div className="page-header">
        <h1 className="h3">Delivery Orders (Outgoing)</h1>
        <button
          onClick={() => navigate("/operations/deliveries/new")}
          className="btn btn-primary"
        >
          <i className="bi bi-plus-lg me-2"></i>NEW
        </button>
      </div>

      {/* Search Bar + View Toggle */}
      <div className="d-flex gap-2 mb-3">
        <div className="input-group flex-grow-1">
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

        {/* View Toggle */}
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewMode('list')}
          >
            <i className="bi bi-list-ul"></i>
          </button>
          <button
            type="button"
            className={`btn ${viewMode === 'kanban' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewMode('kanban')}
          >
            <i className="bi bi-kanban"></i>
          </button>
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Reference</th>
                    <th>Contact</th>
                    <th>Schedule Date</th>
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
                        <td>{new Date(delivery.scheduleDate || delivery.createdAt).toLocaleDateString()}</td>
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
      )}

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="row">
          <div className="col-md-6">
            <KanbanColumn title="Draft" count={groupedDeliveries.draft.length} color="info">
              {groupedDeliveries.draft.map((delivery) => (
                <KanbanCard
                  key={delivery._id}
                  title={delivery.reference}
                  subtitle={delivery.partner}
                  date={delivery.createdAt}
                  onClick={() => navigate(`/operations/deliveries/${delivery._id}`)}
                  badge={{ text: 'DRAFT', className: 'bg-info text-dark' }}
                />
              ))}
              {groupedDeliveries.draft.length === 0 && (
                <p className="text-muted text-center py-4">No draft deliveries</p>
              )}
            </KanbanColumn>
          </div>
          <div className="col-md-6">
            <KanbanColumn title="Validated" count={groupedDeliveries.done.length} color="success">
              {groupedDeliveries.done.map((delivery) => (
                <KanbanCard
                  key={delivery._id}
                  title={delivery.reference}
                  subtitle={delivery.partner}
                  date={delivery.createdAt}
                  onClick={() => navigate(`/operations/deliveries/${delivery._id}`)}
                  badge={{ text: 'DONE', className: 'bg-success' }}
                />
              ))}
              {groupedDeliveries.done.length === 0 && (
                <p className="text-muted text-center py-4">No validated deliveries</p>
              )}
            </KanbanColumn>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryList;
