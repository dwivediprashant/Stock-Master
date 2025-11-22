import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createProduct, getProduct, updateProduct } from "./api";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    unitOfMeasure: "",
    description: "",
    price: "",
    minStockLevel: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await getProduct(id);
      setFormData({
        name: data.name,
        sku: data.sku,
        category: data.category,
        unitOfMeasure: data.unitOfMeasure,
        description: data.description || "",
        price: data.price || 0,
        minStockLevel: data.minStockLevel || 0,
      });
    } catch (err) {
      setError("Failed to load product details");
      toast.error("Failed to load product details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditMode) {
        await updateProduct(id, formData);
        toast.success("Product updated successfully");
      } else {
        await createProduct(formData);
        toast.success("Product created successfully");
      }
      navigate("/products");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to save product";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode && !formData.name) {
    return <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>;
  }

  return (
    <div className="container-fluid p-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h1 className="h4 mb-0">{isEditMode ? "Edit Product" : "Create New Product"}</h1>
            </div>
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger mb-4">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="name">Product Name</label>
                  <input
                    className="form-control"
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g. Steel Rods"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="sku">SKU / Code</label>
                    <input
                      className="form-control"
                      id="sku"
                      name="sku"
                      type="text"
                      placeholder="e.g. SR-001"
                      value={formData.sku}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="category">Category</label>
                    <input
                      className="form-control"
                      id="category"
                      name="category"
                      type="text"
                      placeholder="e.g. Raw Materials"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="unitOfMeasure">Unit of Measure</label>
                    <input
                      className="form-control"
                      id="unitOfMeasure"
                      name="unitOfMeasure"
                      type="text"
                      placeholder="e.g. kg, pcs, m"
                      value={formData.unitOfMeasure}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="price">Price</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        className="form-control"
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="minStockLevel">Minimum Stock Level (Alert Threshold)</label>
                  <input
                    className="form-control"
                    id="minStockLevel"
                    name="minStockLevel"
                    type="number"
                    placeholder="0"
                    value={formData.minStockLevel}
                    onChange={handleChange}
                  />
                  <div className="form-text text-muted">Alerts will be triggered when stock falls below this value.</div>
                </div>

                <div className="mb-4">
                  <label className="form-label" htmlFor="description">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="3"
                    placeholder="Product details..."
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                  <button
                    type="button"
                    className="btn btn-link text-decoration-none text-secondary"
                    onClick={() => navigate("/products")}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary px-4"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      isEditMode ? "Update Product" : "Create Product"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
