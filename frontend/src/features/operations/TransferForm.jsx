import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createOperation, getOperation, updateOperation, validateOperation } from "./api";
import { getProducts } from "../products/api";

const TransferForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    sourceLocation: "WH/Stock",
    destinationLocation: "WH/Production",
    items: [],
  });
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
    if (isEditMode) {
      loadTransfer();
    }
  }, [id]);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products");
    }
  };

  const loadTransfer = async () => {
    try {
      setLoading(true);
      const data = await getOperation(id);
      setFormData({
        sourceLocation: data.sourceLocation || "WH/Stock",
        destinationLocation: data.destinationLocation || "WH/Production",
        items: data.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
      });
      setStatus(data.status);
    } catch (err) {
      setError("Failed to load transfer");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      type: "internal",
      sourceLocation: formData.sourceLocation,
      destinationLocation: formData.destinationLocation,
      items: formData.items,
    };

    try {
      if (isEditMode) {
        await updateOperation(id, payload);
      } else {
        await createOperation(payload);
      }
      navigate("/operations/transfers");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save transfer");
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    if (!window.confirm("Confirm internal transfer?")) return;
    
    setLoading(true);
    try {
      await validateOperation(id);
      navigate("/operations/transfers");
    } catch (err) {
      setError(err.response?.data?.message || "Validation failed");
      setLoading(false);
    }
  };

  if (loading && isEditMode && !formData.items) return <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>;

  const isReadOnly = status === "done";

  return (
    <div className="container-fluid p-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3">
              {isEditMode ? `Internal Transfer ${status === 'done' ? '(Validated)' : ''}` : "New Internal Transfer"}
            </h1>
            <div>
              {isEditMode && status === 'draft' && (
                <button onClick={handleValidate} className="btn btn-success me-2">
                  <i className="bi bi-check-circle me-2"></i>Validate
                </button>
              )}
              <button onClick={() => navigate("/operations/transfers")} className="btn btn-outline-secondary">
                Back
              </button>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label className="form-label">Source Location</label>
                    <select
                      className="form-select"
                      value={formData.sourceLocation}
                      onChange={(e) => setFormData({ ...formData, sourceLocation: e.target.value })}
                      disabled={isReadOnly}
                    >
                      <option value="WH/Stock">WH/Stock</option>
                      <option value="WH/Input">WH/Input</option>
                      <option value="WH/Quality">WH/Quality</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Destination Location</label>
                    <select
                      className="form-select"
                      value={formData.destinationLocation}
                      onChange={(e) => setFormData({ ...formData, destinationLocation: e.target.value })}
                      disabled={isReadOnly}
                    >
                      <option value="WH/Production">WH/Production</option>
                      <option value="WH/Stock">WH/Stock</option>
                      <option value="WH/Output">WH/Output</option>
                      <option value="WH/Scrap">WH/Scrap</option>
                    </select>
                  </div>
                </div>

                <h5 className="mb-3 border-bottom pb-2">Products to Move</h5>
                
                {formData.items.map((item, index) => (
                  <div key={index} className="row mb-2 align-items-end">
                    <div className="col-md-6">
                      <label className="form-label small text-muted">Product</label>
                      <select
                        className="form-select"
                        value={item.product}
                        onChange={(e) => handleItemChange(index, "product", e.target.value)}
                        disabled={isReadOnly}
                        required
                      >
                        <option value="">Select Product</option>
                        {products.map(p => (
                          <option key={p._id} value={p._id}>{p.name} ({p.sku})</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small text-muted">Quantity</label>
                      <input
                        type="number"
                        className="form-control"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                        min="1"
                        disabled={isReadOnly}
                        required
                      />
                    </div>
                    <div className="col-md-1 text-end">
                      {!isReadOnly && (
                        <button type="button" onClick={() => handleRemoveItem(index)} className="btn btn-sm btn-outline-danger">
                          <i className="bi bi-trash"></i>
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {!isReadOnly && (
                  <button type="button" onClick={handleAddItem} className="btn btn-sm btn-outline-primary mt-2">
                    <i className="bi bi-plus"></i> Add Line
                  </button>
                )}

                {!isReadOnly && (
                  <div className="mt-5 pt-3 border-top text-end">
                    <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                      {loading ? "Saving..." : "Save Draft"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferForm;
