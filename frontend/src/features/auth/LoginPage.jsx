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
    <div className="auth-page">
      <div className="auth-layout">
        <div
          className="auth-brand-panel"
          style={{ backgroundImage: `url(${APP_LOGO_URL})` }}
        />

        <div className="auth-form-panel">
          <div className="auth-card">
            <h1 className="auth-title">Sign in</h1>
            <p className="auth-subtitle">
              Access your inventory dashboard and ongoing operations.
            </p>

            {error && <div className="auth-error">{error}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
              <label className="auth-label">
                Email
                <input
                  type="email"
                  className="auth-input form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label className="auth-label">
                Password
                <input
                  type="password"
                  className="auth-input form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>

              <button
                type="submit"
                className="auth-button btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="auth-footer-links">
              <Link to="/signup">Create an account</Link>
              <Link to="/reset/request">Forgot password?</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
