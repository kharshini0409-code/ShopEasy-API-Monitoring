
import { useEffect, useState } from "react";

import {
  Plus,
  RefreshCw,
  Trash2,
  Edit,
  Server,
  X
} from "lucide-react";

import api from "../services/api";
import "./APIManagement.css";

function APIManagement() {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    targetUrl: "",
    description: ""
  });

  // Fetch all registered APIs
  const fetchApis = async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/monitored-apis");

      setApis(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load APIs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApis();
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      targetUrl: "",
      description: ""
    });

    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Open edit form with existing details
  const handleEdit = (item) => {
    setFormData({
      name: item.name || "",
      targetUrl: item.targetUrl || "",
      description: item.description || ""
    });

    setEditingId(item.id);
    setShowForm(true);
    setError("");
  };

  // Add or update API
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (editingId !== null) {
        await api.put(
          `/api/monitored-apis/${editingId}`,
          formData
        );

        alert("API updated successfully!");
      } else {
        await api.post("/api/monitored-apis", formData);

        alert("API registered successfully!");
      }

      resetForm();
      await fetchApis();

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        "Unable to save API. Please check your details."
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete API
  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(`/api/monitored-apis/${id}`);

      alert("API deleted successfully!");

      await fetchApis();

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        "Unable to delete API."
      );
    }
  };

  return (
    <div className="api-management">

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>API Management</h1>
          <p>Register and manage your monitored APIs.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <Plus size={18} />
          Add New API
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="api-form-container">

          <div className="api-form-heading">
            <h2>
              {editingId !== null
                ? "Edit API"
                : "Register New API"}
            </h2>

            <button
              type="button"
              onClick={resetForm}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>API Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter API name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Target URL</label>

              <input
                type="url"
                name="targetUrl"
                placeholder="https://example.com/api"
                value={formData.targetUrl}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                name="description"
                placeholder="Enter API description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
              />
            </div>

            {error && (
              <p className="api-error">{error}</p>
            )}

            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={resetForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId !== null
                  ? "Update API"
                  : "Save API"}
              </button>

            </div>

          </form>
        </div>
      )}

      {/* Registered APIs Table */}
      <div className="api-table-container">

        <div className="table-heading">
          <h2>Registered APIs</h2>

          <button
            onClick={fetchApis}
            disabled={loading}
          >
            <RefreshCw size={16} />
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {error && (
          <p className="api-error">{error}</p>
        )}

        {loading ? (
          <p>Loading APIs...</p>
        ) : apis.length === 0 ? (
          <p>No APIs registered yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>API Name</th>
                <th>Target URL</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {apis.map((item) => (
                <tr key={item.id}>

                  <td>
                    <div className="api-name-cell">
                      <Server size={17} />
                      {item.name}
                    </div>
                  </td>

                  <td className="api-url-cell">
                    {item.targetUrl}
                  </td>

                  <td>
                    <span
                      className={`status-badge ${
                        item.active
                          ? "active"
                          : "inactive"
                      }`}
                    >
                      {item.active
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  <td>
                    <div className="action-buttons">

                      {/* Edit Button */}
                      <button
                        className="edit-button"
                        type="button"
                        title="Edit"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit size={16} />
                      </button>

                      {/* Delete Button */}
                      <button
                        className="delete-button"
                        type="button"
                        title="Delete"
                        onClick={() =>
                          handleDelete(item.id, item.name)
                        }
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}

export default APIManagement;
