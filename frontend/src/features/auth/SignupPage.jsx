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
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center py-4" 
      style={{ 
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #1e3c72 100%)',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '450px' }}>
        <div className="card-body p-5">
          {/* App Logo */}
          <div className="text-center mb-4">
            <img 
              src={APP_LOGO_URL} 
              alt="App Logo" 
              style={{ height: '60px', borderRadius: '8px' }} 
              className="mb-3"
            />
            <h4 className="fw-bold text-navy">Sign Up</h4>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Login Id */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Enter Login Id</label>
              <input
                type="text"
                className="form-control"
                placeholder="6-12 characters (unique)"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                minLength={6}
                maxLength={12}
                required
              />
              <small className="text-muted">Login ID must be unique and 6-12 characters</small>
            </div>

            {/* Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Enter Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Enter Email Id</label>
              <input
                type="email"
                className="form-control"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <small className="text-muted">Email ID should be unique in database</small>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Enter Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Min 8 chars, 1 uppercase, 1 lowercase, 1 special"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Re-Enter Password */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Re-Enter Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-bold mb-3"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "SIGN UP"}
            </button>

            {/* Footer Links */}
            <div className="text-center">
              <span className="text-muted small">Already have an account? </span>
              <Link to="/login" className="text-decoration-none text-primary small fw-bold">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
