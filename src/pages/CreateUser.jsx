import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const CreateUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    role: "general public",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");

      await axios.post(`${API_URL}/api/users`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(`SUCCESS! Invitation sent to ${formData.email}.`);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to invite user");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f6f9",
      }}
    >
      <div style={{ width: "100%", maxWidth: "500px", padding: "20px" }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            marginBottom: "20px",
            background: "none",
            border: "none",
            color: "#007bff",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          &larr; Back to Dashboard
        </button>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            backgroundColor: "#fff",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{ margin: "0 0 10px 0", textAlign: "center", color: "#333" }}
          >
            Invite New User
          </h2>

          <input
            type="text"
            placeholder="Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "6px",
            }}
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            style={{
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "6px",
            }}
          />
          <input
            type="text"
            placeholder="Country"
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            style={{
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "6px",
            }}
          />

          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            style={{
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              backgroundColor: "white",
            }}
          >
            <option value="general public">General Public</option>
            <option value="medical officer">Medical Officer</option>
            <option value="epidemiologist">Epidemiologist</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>


          <button
            type="submit"
            style={{
              padding: "14px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
              marginTop: "10px",
            }}
          >
            Send Invitation
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;