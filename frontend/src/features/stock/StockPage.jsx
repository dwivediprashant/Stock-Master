import { useState, useEffect } from "react";
import { getProducts, updateProduct } from "../products/api";
import { toast } from "react-hot-toast";

const StockPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editQuantity, setEditQuantity] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
      toast.error("Failed to load stock data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (productId) => {
    try {
      await updateProduct(productId, { quantity: editQuantity });
      toast.success("Stock updated successfully");
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      toast.error("Failed to update stock");
    }
  };

  if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>;

  // Filter products based on search term
  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.sku.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="h3 fw-bold">Stock</h1>
        <p className="text-muted">This page contains the warehouse details & location</p>
      </div>

      {/* Search Bar */}
      <div className="mb-3">
        <div className="input-group">
          <span className="input-group-text bg-white">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search products..."
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
      </div>

      {/* Stock Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Product</th>
                  <th>Per Unit Cost</th>
                  <th>On Hand</th>
                  <th>Free to Use</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      <i className="bi bi-box-seam display-4 d-block mb-3"></i>
                      {searchTerm ? "No products match your search." : "No products in stock."}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product._id}>
                      <td className="ps-4">
                        <div className="fw-bold">{product.name}</div>
                        <small className="text-muted">{product.sku}</small>
                      </td>
                      <td>
                        <span className="fw-semibold">₹{product.price?.toLocaleString() || 0}</span>
                      </td>
                      <td>
                        {editingId === product._id ? (
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            style={{ width: '100px' }}
                            value={editQuantity}
                            onChange={(e) => setEditQuantity(parseInt(e.target.value) || 0)}
                            autoFocus
                          />
                        ) : (
                          <span className="badge bg-primary px-3 py-2">
                            {product.quantity || 0}
                          </span>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-success px-3 py-2">
                          {product.quantity || 0}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        {editingId === product._id ? (
                          <div className="d-flex gap-2 justify-content-end">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleUpdateStock(product._id)}
                            >
                              <i className="bi bi-check-lg"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => setEditingId(null)}
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => {
                              setEditingId(product._id);
                              setEditQuantity(product.quantity || 0);
                            }}
                          >
                            <i className="bi bi-pencil me-1"></i>Update
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="alert alert-info mt-3">
        <i className="bi bi-info-circle me-2"></i>
        <strong>Note:</strong> User must be able to update the stock from here. Click "Update" to modify quantities.
      </div>
    </div>
  );
};

export default StockPage;
