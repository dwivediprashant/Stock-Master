import { useAuth } from "../../context/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>My Profile</h1>
          <p className="page-subtitle">Account details for this workspace.</p>
        </div>
      </header>

      <section className="card">
        <dl className="profile-list">
          <div className="profile-row">
            <dt>Name</dt>
            <dd>{user?.name || "-"}</dd>
          </div>
          <div className="profile-row">
            <dt>Email</dt>
            <dd>{user?.email || "-"}</dd>
          </div>
          <div className="profile-row">
            <dt>Role</dt>
            <dd>{user?.role || "staff"}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
};

export default ProfilePage;
