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
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center" 
      style={{ 
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #1e3c72 100%)',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-body p-5">
          {/* App Logo */}
          <div className="text-center mb-4">
            <img 
              src={APP_LOGO_URL} 
              alt="App Logo" 
              style={{ height: '60px', borderRadius: '8px' }} 
              className="mb-3"
            />
            <h4 className="fw-bold text-navy">Login</h4>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Login Id */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Login Id</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your login ID"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-bold mb-3"
              disabled={loading}
            >
              {loading ? "Signing in..." : "SIGN IN"}
            </button>

            {/* Footer Links */}
            <div className="text-center">
              <Link to="/forgot-password" className="text-decoration-none text-muted small">
                Forget Password?
              </Link>
              <span className="text-muted mx-2">|</span>
              <Link to="/signup" className="text-decoration-none text-primary small">
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
