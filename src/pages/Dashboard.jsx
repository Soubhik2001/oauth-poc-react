import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("adminToken");
  const role = localStorage.getItem("userRole"); // Get the role

  const fetchTasks = async () => {
    // If not superadmin, don't bother fetching tasks
    if (role !== "superadmin") {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/tasks/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // --- VIEW FOR NON-ADMINS (Just Logout) ---
  if (role !== "superadmin") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f4f6f9",
        }}
      >
        <div
          style={{
            textAlign: "center",
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h1 style={{ color: "#333", marginBottom: "10px" }}>Welcome</h1>
          <p style={{ color: "#666", marginBottom: "30px" }}>
            You are logged in as <strong>{role}</strong>.
          </p>
          <button
            onClick={handleLogout}
            style={{
              padding: "12px 25px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // --- VIEW FOR SUPERADMINS (Full Dashboard) ---

  const handleAction = async (userId, taskId, action) => {
    const isApproved = action === "approve";
    if (
      !window.confirm(
        `Are you sure you want to ${
          isApproved ? "APPROVE" : "REJECT"
        } this request?`
      )
    )
      return;

    try {
      await axios.post(
        `http://localhost:3000/tasks/${userId}/${action}`,
        { comment: comments[taskId] || "" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`User ${action}d successfully.`);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (err) {
      alert(`Failed to ${action} user`,err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f6f9",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "white",
            padding: "20px 30px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            marginBottom: "30px",
          }}
        >
          <h1 style={{ margin: 0, color: "#007bff", fontSize: "24px" }}>
            Approval Dashboard
          </h1>
          <div>
            <button
              onClick={() => navigate("/create-user")}
              style={{
                marginRight: "10px",
                padding: "10px 18px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              + New User
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: "10px 18px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>
        ) : (
          <>
            <h2 style={{ marginBottom: "20px", color: "#333" }}>
              Pending Approvals ({tasks.length})
            </h2>
            {tasks.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "50px",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  color: "#6c757d",
                }}
              >
                All accounts are approved!
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    border: "1px solid #eee",
                    padding: "25px",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <h3 style={{ margin: "0", color: "#333" }}>
                      {task.user.name}
                    </h3>
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#555",
                        backgroundColor: "#e9ecef",
                        padding: "5px 10px",
                        borderRadius: "15px",
                      }}
                    >
                      Request: <strong>{task.requestedRole?.name}</strong>
                    </span>
                  </div>
                  <p style={{ color: "#666", margin: "0 0 20px 0" }}>
                    {task.user.email}
                  </p>

                  {/* Documents */}
                  {task.documents?.length > 0 && (
                    <div
                      style={{
                        marginBottom: "20px",
                        padding: "15px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "6px",
                      }}
                    >
                      <strong
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontSize: "14px",
                        }}
                      >
                        Documents:
                      </strong>
                      <ul style={{ margin: "0", paddingLeft: "20px" }}>
                        {task.documents.map((doc) => (
                          <li key={doc.id}>
                            <a
                              href={`http://localhost:3000/uploads/${doc.path.replace(
                                "uploads/",
                                ""
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: "#007bff" }}
                            >
                              {doc.filename}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <textarea
                    placeholder="Add comment..."
                    value={comments[task.id] || ""}
                    onChange={(e) =>
                      setComments({ ...comments, [task.id]: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      marginBottom: "15px",
                      borderRadius: "6px",
                      border: "1px solid #ddd",
                      minHeight: "80px",
                      boxSizing: "border-box",
                    }}
                  />

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() =>
                        handleAction(task.user.id, task.id, "approve")
                      }
                      style={{
                        flex: 1,
                        padding: "12px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      APPROVE
                    </button>
                    <button
                      onClick={() =>
                        handleAction(task.user.id, task.id, "reject")
                      }
                      style={{
                        flex: 1,
                        padding: "12px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      REJECT
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
