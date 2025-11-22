import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { RoleManager } from "../../utils/roleHelper.jsx";

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      // Assuming an endpoint exists for updating the logged‑in user profile
      const { data } = await axios.put("/api/auth/me", form);
      setUser(data);
      toast.success("Profile updated");
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  };

  const roleBadge = () => {
    const role = user?.role || "staff";
    const color = role === "manager" ? "primary" : "secondary";
    return <span className={`badge bg-${color} text-capitalize`}>{role}</span>;
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <RoleManager />
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Profile Information</h4>
              <button
                className="btn btn-outline-primary"
                onClick={() => setEditing(!editing)}
              >
                {editing ? "Cancel" : "Edit"}
              </button>
            </div>
            <div className="card-body">
              <dl className="row">
                <dt className="col-sm-3">Login ID</dt>
                <dd className="col-sm-9">{user?.loginId || "-"}</dd>

                <dt className="col-sm-3">Name</dt>
                <dd className="col-sm-9">
                  {editing ? (
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                    />
                  ) : (
                    user?.name || "-"
                  )}
                </dd>

                <dt className="col-sm-3">Email</dt>
                <dd className="col-sm-9">
                  {editing ? (
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                  ) : (
                    user?.email || "-"
                  )}
                </dd>

                <dt className="col-sm-3">Role</dt>
                <dd className="col-sm-9">{roleBadge()}</dd>
              </dl>

              {editing && (
                <div className="d-flex justify-content-end mt-3">
                  <button className="btn btn-success" onClick={handleSave}>
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
