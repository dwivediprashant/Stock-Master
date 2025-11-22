import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { signup } from "./api";
import { APP_LOGO_URL } from "../../config/branding";

const SignupPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [loginId, setLoginId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      // Validate loginId length (6-12 characters)
      if (loginId.length < 6 || loginId.length > 12) {
        toast.error("Login ID must be between 6-12 characters");
        setLoading(false);
        return;
      }

      // Validate password strength
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        toast.error("Password must contain at least 8 characters, including uppercase, lowercase, and a special character");
        setLoading(false);
        return;
      }

      // Validate password match
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        setLoading(false);
        return;
      }

      await signup({ loginId, name, email, password, confirmPassword });
      toast.success("Account created successfully! Please login.");
      navigate("/login");
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to create account";
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
            <p className="lead text-white-50">Join us and take control of your inventory management.</p>
          </div>
        </div>

        {/* Form Panel */}
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-white">
          <div className="w-100 p-4 p-lg-5" style={{ maxWidth: '450px' }}>
            <div className="text-center mb-5 d-md-none">
              <img src={APP_LOGO_URL} alt="Logo" height="60" className="mb-3" />
              <h2 className="fw-bold text-navy">StockMaster</h2>
            </div>

            <h2 className="fw-bold mb-2 text-navy">Create Account</h2>
            <p className="text-muted mb-4">Get started with your free account</p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" htmlFor="loginId">Enter Login Id</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><i className="bi bi-person-badge text-muted"></i></span>
                  <input
                    type="text"
                    className="form-control border-start-0 ps-0"
                    id="loginId"
                    placeholder="6-12 characters (unique)"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    minLength={6}
                    maxLength={12}
                    required
                  />
                </div>
                <small className="text-muted">Must be unique and 6-12 characters long</small>
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="name">Enter Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><i className="bi bi-person text-muted"></i></span>
                  <input
                    type="text"
                    className="form-control border-start-0 ps-0"
                    id="name"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="email">Enter Email Id</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><i className="bi bi-envelope text-muted"></i></span>
                  <input
                    type="email"
                    className="form-control border-start-0 ps-0"
                    id="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <small className="text-muted">Email must be unique in database</small>
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="password">Enter Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><i className="bi bi-lock text-muted"></i></span>
                  <input
                    type="password"
                    className="form-control border-start-0 ps-0"
                    id="password"
                    placeholder="Min 8 chars, uppercase, lowercase, special char"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="confirmPassword">Re-Enter Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><i className="bi bi-lock-fill text-muted"></i></span>
                  <input
                    type="password"
                    className="form-control border-start-0 ps-0"
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                    Creating Account...
                  </>
                ) : (
                  "SIGN UP"
                )}
              </button>

              <div className="text-center">
                <span className="text-muted small">Already have an account? </span>
                <Link to="/login" className="text-decoration-none text-primary small fw-bold">Sign In</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
