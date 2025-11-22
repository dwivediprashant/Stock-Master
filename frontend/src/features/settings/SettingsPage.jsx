import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="container-fluid p-4">
      <h1 className="h3 mb-4">Settings</h1>

      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3">
          <div className="list-group">
            <button
              className={`list-group-item list-group-item-action ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <i className="bi bi-person-circle me-2"></i>
              Profile
            </button>
            <button
              className={`list-group-item list-group-item-action ${activeTab === 'warehouse' ? 'active' : ''}`}
              onClick={() => setActiveTab('warehouse')}
            >
              <i className="bi bi-building me-2"></i>
              Warehouse
            </button>
            <button
              className={`list-group-item list-group-item-action ${activeTab === 'locations' ? 'active' : ''}`}
              onClick={() => setActiveTab('locations')}
            >
              <i className="bi bi-geo-alt me-2"></i>
              Locations
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="col-md-9">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              {activeTab === 'profile' && (
                <div>
                  <h5 className="mb-4">Profile Information</h5>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Name</label>
                    <p className="form-control-plaintext">{user?.name || 'N/A'}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Email</label>
                    <p className="form-control-plaintext">{user?.email || 'N/A'}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Role</label>
                    <p className="form-control-plaintext">
                      <span className={`badge ${user?.role === 'manager' ? 'bg-primary' : 'bg-secondary'}`}>
                        {user?.role?.toUpperCase() || 'STAFF'}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'warehouse' && (
                <div>
                  <h5 className="mb-4">Warehouse Configuration</h5>
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    Warehouse settings will be available in the next update.
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Default Warehouse</label>
                    <select className="form-select" disabled>
                      <option>Main Warehouse</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'locations' && (
                <div>
                  <h5 className="mb-4">Location Management</h5>
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    Location management will be available in the next update.
                  </div>
                  <p className="text-muted">
                    Configure storage locations within your warehouse for better inventory organization.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
