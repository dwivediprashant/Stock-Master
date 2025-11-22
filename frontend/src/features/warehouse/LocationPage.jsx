import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getLocations, createLocation, updateLocation, deleteLocation } from "./locationApi";
import { getWarehouses } from "./api";

const LocationPage = () => {
  const [locations, setLocations] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", sortCode: "", warehouse: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [locs, whs] = await Promise.all([getLocations(), getWarehouses()]);
      setLocations(locs);
      setWarehouses(whs);
    } catch (err) {
      toast.error("Failed to load data");
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
        await updateLocation(editing._id, form);
        toast.success("Location updated");
      } else {
        await createLocation(form);
        toast.success("Location created");
      }
      setShowForm(false);
      setForm({ name: "", sortCode: "", warehouse: "" });
      setEditing(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save location");
    }
  };

  const handleEdit = (loc) => {
    setEditing(loc);
    setForm({ name: loc.name, sortCode: loc.sortCode, warehouse: loc.warehouse._id });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this location?")) return;
    try {
      await deleteLocation(id);
      toast.success("Location deleted");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete location");
    }
  };

  if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 fw-bold">Locations</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <i className="bi bi-plus-lg me-2"></i>New Location
        </button>
      </div>

      {showForm && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">{editing ? "Edit" : "Create"} Location</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Name</label>
                <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Sort Code</label>
                <input type="text" className="form-control" name="sortCode" value={form.sortCode} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Warehouse</label>
                <select className="form-select" name="warehouse" value={form.warehouse} onChange={handleChange} required>
                  <option value="">Select warehouse...</option>
                  {warehouses.map((wh) => (
                    <option key={wh._id} value={wh._id}>
                      {wh.name} ({wh.shortCode})
                    </option>
                  ))}
                </select>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">{editing ? "Update" : "Create"}</button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => { setShowForm(false); setEditing(null); }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Name</th>
                  <th>Sort Code</th>
                  <th>Warehouse</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((loc) => (
                  <tr key={loc._id}>
                    <td className="ps-4 fw-bold text-primary">{loc.name}</td>
                    <td>{loc.sortCode}</td>
                    <td>{loc.warehouse?.name || "-"} ({loc.warehouse?.shortCode || "-"})</td>
                    <td className="text-end pe-4">
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(loc)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(loc._id)}>
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

export default LocationPage;
