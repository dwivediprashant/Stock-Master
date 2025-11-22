import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { APP_LOGO_URL } from "../../config/branding";

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to login";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Brand Panel */}
        <div className="col-md-6 d-none d-md-flex bg-navy text-white align-items-center justify-content-center flex-column p-5">
          <div className="text-center mb-4">
            <img src={APP_LOGO_URL} alt="Logo" style={{ height: '80px', borderRadius: '12px' }} className="mb-4 shadow-lg" />
            <h1 className="display-4 fw-bold mb-3">StockMaster</h1>
            <p className="lead text-white-50">Streamline your inventory operations with precision and ease.</p>
          </div>
        </div>

        {/* Form Panel */}
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-white">
          <div className="w-100 p-4 p-lg-5" style={{ maxWidth: '450px' }}>
            <div className="text-center mb-5 d-md-none">
              <img src={APP_LOGO_URL} alt="Logo" height="60" className="mb-3" />
              <h2 className="fw-bold text-navy">StockMaster</h2>
            </div>

            <h2 className="fw-bold mb-2 text-navy">Welcome Back</h2>
            <p className="text-muted mb-4">Please sign in to your account</p>

            {error && (
              <div className="alert alert-danger d-flex align-items-center" role="alert">
                <i className="bi bi-exclamation-circle-fill me-2"></i>
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" htmlFor="email">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><i className="bi bi-envelope text-muted"></i></span>
                  <input
                    type="email"
                    className="form-control border-start-0 ps-0"
                    id="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100 py-2 mb-3 fw-bold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              <div className="d-flex justify-content-between align-items-center mt-4">
                <Link to="/signup" className="text-decoration-none text-primary fw-medium">Create account</Link>
                <Link to="/reset/request" className="text-decoration-none text-muted small">Forgot password?</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
