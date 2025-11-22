import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { canPerformAction, PERMISSIONS } from "../../utils/permissions";
import { getProducts, deleteProduct } from "./api";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check permissions
  const canCreate = canPerformAction(user?.role, PERMISSIONS.CREATE_PRODUCT);
  const canDelete = canPerformAction(user?.role, PERMISSIONS.DELETE_PRODUCT);

  // Debug logging
  console.log("User role:", user?.role);
  console.log("Can create product:", canCreate);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        setProducts(products.filter((p) => p._id !== id));
      } catch (err) {
        alert("Failed to delete product");
        console.error(err);
      }
    }
  };

  if (loading)
    return (
      <div className="p-4 text-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  if (error) return <div className="alert alert-danger m-4">{error}</div>;

  return (
    <div className="container-fluid p-4">
      <div className="page-header">
        <h1 className="h3">Products</h1>
        {/* Temporarily show button always for debugging */}
        <button
          onClick={() => navigate("/products/new")}
          className="btn btn-primary"
        >
          <i className="bi bi-plus-lg me-2"></i>Add Product
        </button>
        {/* Original conditional button */}
        {/* {canCreate && (
          <button
            onClick={() => navigate("/products/new")}
            className="btn btn-primary"
          >
            <i className="bi bi-plus-lg me-2"></i>Add Product
          </button>
        )} */}
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Name</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <i className="bi bi-box-seam display-4 d-block mb-3"></i>
                      No products found. Create one to get started.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id}>
                      <td className="ps-4">
                        <div className="fw-bold text-navy">{product.name}</div>
                        <small className="text-muted">
                          {product.description?.substring(0, 30)}...
                        </small>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {product.sku}
                        </span>
                      </td>
                      <td>{product.category}</td>
                      <td>
                        <span
                          className={`badge ${
                            product.currentStock <= product.minStockLevel
                              ? "bg-warning text-dark"
                              : "bg-success"
                          }`}
                        >
                          {product.currentStock} {product.unitOfMeasure}
                        </span>
                      </td>
                      <td>${product.price?.toFixed(2)}</td>
                      <td className="text-end pe-4">
                        <button
                          onClick={() =>
                            navigate(`/products/${product._id}/edit`)
                          }
                          className="btn btn-sm btn-outline-secondary me-2"
                          title="Edit"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="btn btn-sm btn-outline-danger"
                          title="Delete"
                          disabled={!canDelete}
                          style={{
                            opacity: canDelete ? 1 : 0.5,
                            cursor: canDelete ? "pointer" : "not-allowed",
                          }}
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
        </div>
      </div>
    </div>
  );
};

export default ProductList;
