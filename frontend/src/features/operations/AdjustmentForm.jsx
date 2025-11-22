import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createOperation, getOperation, updateOperation, validateOperation } from "./api";
import { getProducts } from "../products/api";

const AdjustmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    items: [],
  });
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
    if (isEditMode) {
      loadAdjustment();
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

  const loadAdjustment = async () => {
    try {
      setLoading(true);
      const data = await getOperation(id);
      setFormData({
        items: data.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity, // This is the difference
          // We don't have the original theoretical quantity stored in the operation item easily unless we snapshot it.
          // For now, we will just show the adjustment value.
        })),
      });
      setStatus(data.status);
    } catch (err) {
      setError("Failed to load adjustment");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { product: "", theoretical: 0, counted: 0, quantity: 0 }]
    }));
  };

  const handleRemoveItem = (index) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    
    if (field === "product") {
      const product = products.find(p => p._id === value);
      newItems[index].product = value;
      newItems[index].theoretical = product ? product.currentStock : 0;
      newItems[index].counted = product ? product.currentStock : 0;
      newItems[index].quantity = 0; // No difference initially
    } else if (field === "counted") {
      newItems[index].counted = Number(value);
      newItems[index].quantity = Number(value) - newItems[index].theoretical;
    }

    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      type: "adjustment",
      items: formData.items.map(item => ({
        product: item.product,
        quantity: item.quantity // The difference
      })),
    };

    try {
      if (isEditMode) {
        await updateOperation(id, payload);
      } else {
        await createOperation(payload);
      }
      navigate("/operations/adjustments");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save adjustment");
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    if (!window.confirm("This will update stock levels permanently based on the differences. Continue?")) return;
    
    setLoading(true);
    try {
      await validateOperation(id);
      navigate("/operations/adjustments");
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
              {isEditMode ? `Adjustment ${status === 'done' ? '(Validated)' : ''}` : "New Inventory Adjustment"}
            </h1>
            <div>
              {isEditMode && status === 'draft' && (
                <button onClick={handleValidate} className="btn btn-success me-2">
                  <i className="bi bi-check-circle me-2"></i>Validate
                </button>
              )}
              <button onClick={() => navigate("/operations/adjustments")} className="btn btn-outline-secondary">
                Back
              </button>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              {error && <div className="alert alert-danger">{error}</div>}
              
              <div className="alert alert-info small">
                <i className="bi bi-info-circle me-2"></i>
                Enter the <strong>Real Quantity</strong> you counted. The system will calculate the difference to adjust.
              </div>

              <form onSubmit={handleSubmit}>
                <h5 className="mb-3 border-bottom pb-2">Products to Adjust</h5>
                
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: '40%' }}>Product</th>
                        <th style={{ width: '15%' }}>Theoretical</th>
                        <th style={{ width: '15%' }}>Real Quantity</th>
                        <th style={{ width: '15%' }}>Difference</th>
                        <th style={{ width: '5%' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.items.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <select
                              className="form-select form-select-sm"
                              value={item.product}
                              onChange={(e) => handleItemChange(index, "product", e.target.value)}
                              disabled={isReadOnly || isEditMode} // Lock product in edit mode for simplicity or allow? Allow.
                              required
                            >
                              <option value="">Select Product</option>
                              {products.map(p => (
                                <option key={p._id} value={p._id}>{p.name} ({p.sku})</option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              value={item.theoretical || 0}
                              disabled
                              readOnly
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              value={item.counted !== undefined ? item.counted : (item.theoretical + item.quantity)}
                              onChange={(e) => handleItemChange(index, "counted", e.target.value)}
                              disabled={isReadOnly}
                              required
                            />
                          </td>
                          <td>
                            <span className={`badge ${item.quantity > 0 ? 'bg-success' : item.quantity < 0 ? 'bg-danger' : 'bg-secondary'}`}>
                              {item.quantity > 0 ? '+' : ''}{item.quantity}
                            </span>
                          </td>
                          <td className="text-center">
                            {!isReadOnly && (
                              <button type="button" onClick={() => handleRemoveItem(index)} className="btn btn-sm btn-outline-danger border-0">
                                <i className="bi bi-trash"></i>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

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

export default AdjustmentForm;
