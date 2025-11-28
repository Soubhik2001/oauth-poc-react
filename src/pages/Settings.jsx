import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";

const Settings = () => {
  // 1. DECLARE ALL HOOKS FIRST (Rules of Hooks)
  const [sizeInMB, setSizeInMB] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("adminToken");
  const role = localStorage.getItem("userRole");

  useEffect(() => {
    // If not superadmin, do nothing (the component will redirect via render below)
    if (role !== "superadmin") return;

    const fetchSetting = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/settings/MAX_FILE_SIZE",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const bytes = res.data?.value || 0;
        const mb = (bytes / (1024 * 1024)).toFixed(2);
        setSizeInMB(mb);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch settings", err);
        setMsg("Error loading settings.");
        setLoading(false);
      }
    };

    fetchSetting();
  }, []); // Empty dependency array

  // 2. SECURITY CHECK (Must happen AFTER hooks)
  if (role !== "superadmin") {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setMsg("");

    // Convert MB back to Bytes for storage
    const bytes = parseFloat(sizeInMB) * 1024 * 1024;

    try {
      await axios.put(
        "http://localhost:3000/settings/MAX_FILE_SIZE",
        { value: Math.floor(bytes).toString() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("Settings updated successfully!");
    } catch (err) {
      setMsg("Failed to update settings.", err);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>
    );
  }

  // 3. MAIN RENDER
  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: "#f4f6f9",
        padding: "40px 0",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "none",
            border: "none",
            color: "#007bff",
            cursor: "pointer",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          &larr; Back to Dashboard
        </button>

        <h2 style={{ marginBottom: "20px", color: "#333" }}>
          System Configuration
        </h2>

        {msg && (
          <p
            style={{
              padding: "10px",
              backgroundColor:
                msg.includes("Error") || msg.includes("Failed")
                  ? "#ffebee"
                  : "#e8f5e9",
              color: "#333",
              borderRadius: "4px",
              textAlign: "center",
            }}
          >
            {msg}
          </p>
        )}

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
                color: "#555",
              }}
            >
              Max File Upload Size (MB)
            </label>
            <input
              type="number"
              step="0.1"
              value={sizeInMB}
              onChange={(e) => setSizeInMB(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                fontSize: "16px",
              }}
              required
            />
            <small
              style={{ color: "#666", marginTop: "5px", display: "block" }}
            >
              This controls the maximum file size allowed for user registration
              documents.
            </small>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
