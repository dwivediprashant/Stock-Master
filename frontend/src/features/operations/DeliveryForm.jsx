import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createOperation, getOperation, updateOperation, validateOperation } from "./api";
import { getProducts } from "../products/api";

const DeliveryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    partner: "",
    items: [],
  });
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
    if (isEditMode) {
      loadDelivery();
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

  const loadDelivery = async () => {
    try {
      setLoading(true);
      const data = await getOperation(id);
      setFormData({
        partner: data.partner || "",
        items: data.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
      });
      setStatus(data.status);
    } catch (err) {
      setError("Failed to load delivery order");
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
      type: "delivery",
      partner: formData.partner,
      items: formData.items,
    };

    try {
      if (isEditMode) {
        await updateOperation(id, payload);
      } else {
        await createOperation(payload);
      }
      navigate("/operations/deliveries");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save delivery order");
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    if (!window.confirm("This will reserve and decrease stock levels permanently. Continue?")) return;
    
    setLoading(true);
    try {
      await validateOperation(id);
      navigate("/operations/deliveries");
    } catch (err) {
      setError(err.response?.data?.message || "Validation failed. Check stock availability.");
      setLoading(false);
    }
  };

  if (loading && isEditMode && !formData.partner) return <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>;

  const isReadOnly = status === "done";

  return (
    <div className="container-fluid p-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3">
              {isEditMode ? `Delivery Order ${status === 'done' ? '(Validated)' : ''}` : "New Delivery Order"}
            </h1>
            <div>
              {isEditMode && status === 'draft' && (
                <button onClick={handleValidate} className="btn btn-success me-2">
                  <i className="bi bi-check-circle me-2"></i>Validate
                </button>
              )}
              <button onClick={() => navigate("/operations/deliveries")} className="btn btn-outline-secondary">
                Back
              </button>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label">Customer</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.partner}
                    onChange={(e) => setFormData({ ...formData, partner: e.target.value })}
                    placeholder="e.g. John Doe"
                    disabled={isReadOnly}
                    required
                  />
                </div>

                <h5 className="mb-3 border-bottom pb-2">Products to Deliver</h5>
                
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
                          <option key={p._id} value={p._id}>
                            {p.name} (Stock: {p.currentStock} {p.unitOfMeasure})
                          </option>
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

export default DeliveryForm;
