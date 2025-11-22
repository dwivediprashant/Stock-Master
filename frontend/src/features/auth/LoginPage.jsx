import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { APP_LOGO_URL } from "../../config/branding";

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(loginId, password);
      toast.success("Welcome back!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to login";
      toast.error(message);
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

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" htmlFor="loginId">Login Id</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><i className="bi bi-person text-muted"></i></span>
                  <input
                    type="text"
                    className="form-control border-start-0 ps-0"
                    id="loginId"
                    placeholder="Enter your login ID"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="password">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><i className="bi bi-lock text-muted"></i></span>
                  <input
                    type="password"
                    className="form-control border-start-0 ps-0"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  "SIGN IN"
                )}
              </button>

              <div className="text-center mt-3">
                <Link to="/forgot-password" className="text-decoration-none text-muted small me-2">Forget Password?</Link>
                <span className="text-muted">|</span>
                <Link to="/signup" className="text-decoration-none text-primary small ms-2">Sign Up</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
