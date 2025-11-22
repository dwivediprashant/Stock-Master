import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createOperation, getOperation, updateOperation, validateOperation } from "./api";
import { getProducts } from "../products/api";

const ReceiptForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    partner: "",
    responsible: "",
    scheduleDate: new Date().toISOString().split('T')[0],
    items: [],
  });
  const [reference, setReference] = useState("");
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
    if (isEditMode) {
      loadReceipt();
    }
  }, [id]);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products");
      toast.error("Failed to load products list");
    }
  };

  const loadReceipt = async () => {
    try {
      setLoading(true);
      const data = await getOperation(id);
      setReference(data.reference);
      setFormData({
        partner: data.partner || "",
        responsible: data.responsible || "",
        scheduleDate: data.scheduleDate ? new Date(data.scheduleDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        items: data.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
      });
      setStatus(data.status);
    } catch (err) {
      toast.error("Failed to load receipt");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { product: "", quantity: 1 }]
    }));
  };

  const handleRemoveItem = (index) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const validatePayload = (payload) => {
    const {
      partner,
      scheduleDate,
      items,
    } = payload;

    if (!partner) throw new Error("Partner is required");
    if (!scheduleDate) throw new Error("Schedule date is required");

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("At least one product must be added");
    }

    items.forEach((it, idx) => {
      if (!it.product) throw new Error(`Item #${idx + 1}: product is required`);
      if (!it.quantity || it.quantity <= 0)
        throw new Error(`Item #${idx + 1}: quantity must be > 0`);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      type: "receipt",
      partner: formData.partner,
      responsible: formData.responsible,
      scheduleDate: formData.scheduleDate,
      items: formData.items,
    };

    try {
      validatePayload(payload);

      if (isEditMode) {
        await updateOperation(id, payload);
        toast.success("Receipt updated");
      } else {
        const newOp = await createOperation(payload);
        toast.success("Receipt draft created");
        navigate(`/operations/receipts/${newOp._id}`);
        return;
      }
      loadReceipt();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to save receipt";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    try {
      setLoading(true);
      await validateOperation(id);
      toast.success("Receipt validated successfully");
      loadReceipt();
    } catch (err) {
      toast.error("Failed to validate receipt");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to cancel this receipt?")) {
      try {
        setLoading(true);
        await updateOperation(id, { status: "canceled" });
        toast.success("Receipt canceled");
        navigate("/operations/receipts");
      } catch (err) {
        toast.error("Failed to cancel receipt");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && isEditMode) {
    return <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>;
  }

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Receipt</h1>
          {reference && <p className="text-muted mb-0">{reference}</p>}
        </div>
        <div className="d-flex gap-2">
          {isEditMode && status === "draft" && (
            <button className="btn btn-success" onClick={handleValidate} disabled={loading}>
              <i className="bi bi-check-circle me-2"></i>Validate
            </button>
          )}
          {isEditMode && status !== "canceled" && (
            <>
              <button className="btn btn-outline-secondary" disabled={loading}>
                <i className="bi bi-printer me-2"></i>Print
              </button>
              <button className="btn btn-danger" onClick={handleCancel} disabled={loading}>
                <i className="bi bi-x-circle me-2"></i>Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Status Badge */}
      {isEditMode && (
        <div className="mb-3">
          <span className={`badge ${status === 'draft' ? 'bg-info' : status === 'done' ? 'bg-success' : 'bg-secondary'} px-3 py-2`}>
            {status.toUpperCase()}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3">
              {/* Partner */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Partner</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.partner}
                  onChange={(e) => setFormData({ ...formData, partner: e.target.value })}
                  placeholder="Vendor/Supplier name"
                  required
                />
              </div>

              {/* Responsible */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Responsible</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.responsible}
                  onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                  placeholder="Person responsible"
                />
              </div>

              {/* Schedule Date */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Schedule Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.scheduleDate}
                  onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white border-bottom">
            <h5 className="mb-0 fw-bold">Products</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Product</th>
                    <th style={{ width: '150px' }}>Quantity</th>
                    <th style={{ width: '80px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-muted">
                        No products added yet. Click "New Product" to add.
                      </td>
                    </tr>
                  ) : (
                    formData.items.map((item, index) => (
                      <tr key={index}>
                        <td className="ps-4">
                          <select
                            className="form-select"
                            value={item.product}
                            onChange={(e) => handleItemChange(index, "product", e.target.value)}
                            required
                          >
                            <option value="">Select product...</option>
                            {products.map((product) => (
                              <option key={product._id} value={product._id}>
                                [{product.sku}] {product.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value) || 0)}
                            min="1"
                            required
                          />
                        </td>
                        <td className="text-center">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="card-footer bg-white border-top">
              <button type="button" className="btn btn-outline-primary" onClick={handleAddItem}>
                <i className="bi bi-plus-lg me-2"></i>New Product
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {(!isEditMode || status === "draft") && (
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : isEditMode ? "Update Receipt" : "Create Receipt"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate("/operations/receipts")}
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ReceiptForm;
