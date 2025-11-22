import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createOperation, getOperation, updateOperation, validateOperation } from "./api";
import { getProducts } from "../products/api";

const DeliveryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    partner: "",
    deliveryAddress: "",
    availableDate: new Date().toISOString().split('T')[0],
    responsible: "",
    destinationType: "customer",
    items: [],
  });
  const [reference, setReference] = useState("");
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(false);

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
      toast.error("Failed to load products list");
    }
  };

  const loadDelivery = async () => {
    try {
      setLoading(true);
      const data = await getOperation(id);
      setReference(data.reference);
      setFormData({
        partner: data.partner || "",
        deliveryAddress: data.deliveryAddress || "",
        availableDate: data.availableDate ? new Date(data.availableDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        responsible: data.responsible || "",
        destinationType: data.destinationType || "customer",
        items: data.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
      });
      setStatus(data.status);
    } catch (err) {
      toast.error("Failed to load delivery");
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
    setLoading(true);

    const payload = {
      type: "delivery",
      partner: formData.partner,
      deliveryAddress: formData.deliveryAddress,
      availableDate: formData.availableDate,
      responsible: formData.responsible,
      destinationType: formData.destinationType,
      items: formData.items,
    };

    try {
      if (isEditMode) {
        await updateOperation(id, payload);
        toast.success("Delivery updated");
      } else {
        const newOp = await createOperation(payload);
        toast.success("Delivery draft created");
        navigate(`/operations/deliveries/${newOp._id}`);
        return;
      }
      loadDelivery();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to save delivery";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    try {
      setLoading(true);
      await validateOperation(id);
      toast.success("Delivery validated - Products marked as out of stock");
      loadDelivery();
    } catch (err) {
      toast.error("Failed to validate delivery");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to cancel this delivery?")) {
      try {
        setLoading(true);
        await updateOperation(id, { status: "canceled" });
        toast.success("Delivery canceled");
        navigate("/operations/deliveries");
      } catch (err) {
        toast.error("Failed to cancel delivery");
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
          <h1 className="h3 fw-bold mb-1">Delivery</h1>
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

      {/* Status Badge & Flow */}
      {isEditMode && (
        <div className="mb-3">
          <span className={`badge ${status === 'draft' ? 'bg-info' : status === 'done' ? 'bg-success' : 'bg-secondary'} px-3 py-2`}>
            {status.toUpperCase()}
          </span>
          <small className="text-muted ms-3">Draft → Waiting → Ready → Done</small>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3">
              {/* Partner (Customer) */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Customer</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.partner}
                  onChange={(e) => setFormData({ ...formData, partner: e.target.value })}
                  placeholder="Customer name"
                  required
                />
              </div>

              {/* Delivery Address */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Delivery Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  placeholder="Delivery address"
                  required
                />
              </div>

              {/* Available Date */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Available Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.availableDate}
                  onChange={(e) => setFormData({ ...formData, availableDate: e.target.value })}
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

              {/* Destination Type */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Destination Type</label>
                <select
                  className="form-select"
                  value={formData.destinationType}
                  onChange={(e) => setFormData({ ...formData, destinationType: e.target.value })}
                  required
                >
                  <option value="customer">Customer</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="other">Other</option>
                </select>
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
                        No products added yet. Click "Add New Product" to add.
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
                <i className="bi bi-plus-lg me-2"></i>Add New Product
              </button>
            </div>
          </div>
        </div>

        {/* Note about validation */}
        {isEditMode && status === "draft" && (
          <div className="alert alert-info mb-4">
            <i className="bi bi-info-circle me-2"></i>
            <strong>Note:</strong> After validation, products will be marked as out of stock.
          </div>
        )}

        {/* Save Button */}
        {(!isEditMode || status === "draft") && (
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : isEditMode ? "Update Delivery" : "Create Delivery"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate("/operations/deliveries")}
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default DeliveryForm;
