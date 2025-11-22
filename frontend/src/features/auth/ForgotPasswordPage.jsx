import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "./api";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await forgotPassword(email);
      setMessage("If an account exists, an OTP has been sent to your email.");
      // Optionally redirect to reset page after a few seconds
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex min-vh-100 align-items-center justify-content-center bg-light">
      <div className="card shadow-sm border-0" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body p-4 p-sm-5">
          <div className="text-center mb-4">
            <h1 className="h4 fw-bold text-primary">Forgot Password</h1>
            <p className="text-muted small">Enter your email to receive a reset OTP.</p>
          </div>

          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          {message && <div className="alert alert-success py-2 small">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label small fw-bold text-uppercase text-muted">Email Address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@company.com"
              />
            </div>

            <div className="d-grid mb-3">
              <button type="submit" className="btn btn-primary py-2 fw-bold" disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          </form>

          <div className="text-center">
            <Link to="/login" className="text-decoration-none small text-muted">
              <i className="bi bi-arrow-left me-1"></i> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
