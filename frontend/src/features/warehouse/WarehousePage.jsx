import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "./api";

const WarehousePage = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", shortCode: "", address: "" });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const data = await getWarehouses();
      // Ensure data is an array before setting state
      if (Array.isArray(data)) {
        setWarehouses(data);
      } else {
        console.error("API did not return an array:", data);
        setWarehouses([]);
        toast.error("Invalid data format received from server");
      }
    } catch (err) {
      console.error("Failed to fetch warehouses:", err);
      setWarehouses([]);
      toast.error(err.response?.data?.message || "Failed to load warehouses");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateWarehouse(editing._id, form);
        toast.success("Warehouse updated");
      } else {
        await createWarehouse(form);
        toast.success("Warehouse created");
      }
      setShowForm(false);
      setForm({ name: "", shortCode: "", address: "" });
      setEditing(null);
      fetchWarehouses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save warehouse");
    }
  };

  const handleEdit = (warehouse) => {
    setEditing(warehouse);
    setForm({
      name: warehouse.name,
      shortCode: warehouse.shortCode,
      address: warehouse.address,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this warehouse?")) return;
    try {
      await deleteWarehouse(id);
      toast.success("Warehouse deleted");
      fetchWarehouses();
    } catch (err) {
      toast.error("Failed to delete warehouse");
    }
  };

  if (loading)
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 fw-bold">Warehouses</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <i className="bi bi-plus-lg me-2"></i>New Warehouse
        </button>
      </div>

      {/* Form Modal (simple inline) */}
      {showForm && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">
              {editing ? "Edit" : "Create"} Warehouse
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Short Code</label>
                <input
                  type="text"
                  className="form-control"
                  name="shortCode"
                  value={form.shortCode}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Address</label>
                <textarea
                  className="form-control"
                  name="address"
                  rows={3}
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  {editing ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditing(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Warehouse Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Name</th>
                  <th>Short Code</th>
                  <th>Address</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(warehouses) &&
                  warehouses.map((w) => (
                    <tr key={w._id}>
                      <td className="ps-4 fw-bold text-primary">{w.name}</td>
                      <td>{w.shortCode}</td>
                      <td>{w.address}</td>
                      <td className="text-end pe-4">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEdit(w)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(w._id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehousePage;
