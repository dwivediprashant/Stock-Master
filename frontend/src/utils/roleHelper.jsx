/**
 * Temporary role helper for development
 * This should be removed in production and managed through proper backend admin interface
 */

import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

/**
 * Get current user info
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("stockmaster_user");
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Update user role (development only)
 * In production, this should be handled by backend admin API
 */
export const updateUserRole = (newRole) => {
  try {
    const userStr = localStorage.getItem("stockmaster_user");
    if (!userStr) {
      toast.error("No user found in storage");
      return false;
    }

    const user = JSON.parse(userStr);
    user.role = newRole;

    localStorage.setItem("stockmaster_user", JSON.stringify(user));
    toast.success(`Role updated to ${newRole}`);

    // Force page reload to update context
    window.location.reload();
    return true;
  } catch (error) {
    console.error("Failed to update role:", error);
    toast.error("Failed to update role");
    return false;
  }
};

/**
 * Component for role management (development only)
 */
export const RoleManager = () => {
  const { user } = useAuth();

  const handleRoleChange = (role) => {
    updateUserRole(role);
  };

  return (
    <div className="card mb-3">
      <div className="card-header">
        <h6 className="mb-0">Role Management (Development)</h6>
      </div>
      <div className="card-body">
        <p className="mb-2">
          Current role: <strong>{user?.role || "Unknown"}</strong>
        </p>
        <div className="btn-group" role="group">
          <button
            className={`btn btn-sm ${
              user?.role === "staff" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => handleRoleChange("staff")}
          >
            Staff
          </button>
          <button
            className={`btn btn-sm ${
              user?.role === "manager" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => handleRoleChange("manager")}
          >
            Manager
          </button>
          <button
            className={`btn btn-sm ${
              user?.role === "admin" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => handleRoleChange("admin")}
          >
            Admin
          </button>
        </div>
        <small className="text-muted d-block mt-2">
          Staff: View products, create receipts/deliveries
          <br />
          Manager: Create/update products & warehouses
          <br />
          Admin: Full system access
        </small>
      </div>
    </div>
  );
};
