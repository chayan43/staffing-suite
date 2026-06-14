import { useEffect, useState } from "react";
import axios from "axios";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", manager: "" });

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/departments");
      setDepartments(res.data);
    } catch (err) { console.log(err); }
  };

  useEffect(() => { fetchDepartments(); }, []);

  const addDepartment = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/departments/${editingId}`, form);
        alert("✅ Department Updated");
      } else {
        await axios.post("http://localhost:5000/api/departments", form);
        alert("✅ Department Added");
      }
      setForm({ name: "", manager: "" });
      setEditingId(null);
      fetchDepartments();
    } catch (err) { console.log(err); }
  };

  const editDepartment = (dept) => {
    setEditingId(dept.id);
    setForm({ name: dept.name, manager: dept.manager });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteDepartment = async (id) => {
    if (!window.confirm("Delete this department?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/departments/${id}`);
      fetchDepartments();
    } catch (err) { console.log(err); }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", manager: "" });
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const deptColors = [
    { bg: "#1e3a5f", color: "#3b82f6" },
    { bg: "#2e1f5e", color: "#8b5cf6" },
    { bg: "#14532d", color: "#22c55e" },
    { bg: "#3b2a0a", color: "#f59e0b" },
    { bg: "#3a1a1a", color: "#ef4444" },
    { bg: "#1a3a2a", color: "#10b981" },
  ];

  return (
    <div className="app">
      {/* ── Sidebar ── */}
      <div className="sidebar">
        <div className="logo">STAFFING SUITE</div>
        <div className="tagline">Workforce Intelligence Platform</div>
        <div className="menu">
          <a href="/">Dashboard</a>
          <a href="/employees">Employees</a>
          <a href="/departments">Departments</a>
          <a href="/leave-management">Leave Management</a>
        </div>
        <button onClick={logout} style={{
          marginTop: "40px", width: "100%", padding: "12px",
          border: "none", borderRadius: "10px",
          background: "#ef4444", color: "white", cursor: "pointer",
        }}>
          Logout
        </button>
      </div>

      {/* ── Main ── */}
      <div className="main">
        <h1 style={{ fontSize: "42px", marginBottom: "10px" }}>Departments</h1>
        <p style={{ color: "#94a3b8", marginBottom: "30px" }}>Manage Your Organization Structure</p>

        {/* Form Card */}
        <div style={{
          background: "#111827", padding: "28px",
          borderRadius: "20px", border: "1px solid #1f2937", marginBottom: "30px",
        }}>
          <h2 style={{ marginBottom: "20px", fontSize: "18px" }}>
            {editingId ? "✏️ Edit Department" : "➕ Add Department"}
          </h2>
          <form onSubmit={addDepartment} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <input
              required
              placeholder="Department Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
            />
            <input
              required
              placeholder="Manager Name"
              value={form.manager}
              onChange={(e) => setForm({ ...form, manager: e.target.value })}
              style={inputStyle}
            />
            <button type="submit" style={{
              padding: "14px", border: "none", borderRadius: "12px",
              background: "#2563eb", color: "white", fontWeight: "600", cursor: "pointer",
            }}>
              {editingId ? "Update Department" : "Add Department"}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} style={{
                padding: "14px", border: "1px solid #374151", borderRadius: "12px",
                background: "transparent", color: "#94a3b8", cursor: "pointer",
              }}>
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* Stats Row */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
          <div style={{
            background: "#111827", border: "1px solid #1f2937", borderRadius: "16px",
            padding: "18px 24px", display: "flex", alignItems: "center", gap: "14px",
          }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#1e3a5f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🏢</div>
            <div>
              <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Departments</p>
              <p style={{ fontSize: "28px", fontWeight: "700", color: "#3b82f6" }}>{departments.length}</p>
            </div>
          </div>
          <div style={{
            background: "#111827", border: "1px solid #1f2937", borderRadius: "16px",
            padding: "18px 24px", display: "flex", alignItems: "center", gap: "14px",
          }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#14532d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>👔</div>
            <div>
              <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Managers</p>
              <p style={{ fontSize: "28px", fontWeight: "700", color: "#22c55e" }}>{departments.length}</p>
            </div>
          </div>
        </div>

        {/* Department Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {departments.length === 0 && (
            <p style={{ color: "#475569", gridColumn: "1/-1", textAlign: "center", padding: "40px" }}>
              No departments yet. Add one above!
            </p>
          )}
          {departments.map((dept, i) => {
            const palette = deptColors[i % deptColors.length];
            const initials = dept.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
            return (
              <div key={dept.id} style={{
                background: "#111827", border: "1px solid #1f2937",
                borderRadius: "20px", padding: "24px",
                transition: "border-color 0.2s",
              }}>
                {/* Icon + Name */}
                <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                  <div style={{
                    width: "52px", height: "52px", borderRadius: "14px",
                    background: palette.bg, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "18px", fontWeight: "700",
                    color: palette.color, flexShrink: 0,
                  }}>
                    {initials}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "17px", fontWeight: "600", marginBottom: "4px" }}>{dept.name}</h3>
                    <span style={{
                      fontSize: "11px", padding: "3px 10px", borderRadius: "20px",
                      background: palette.bg, color: palette.color,
                    }}>
                      Department
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ borderTop: "1px solid #1f2937", margin: "14px 0" }} />

                {/* Manager */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "50%",
                    background: "#1f2937", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "14px",
                  }}>
                    👤
                  </div>
                  <div>
                    <p style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "2px" }}>Manager</p>
                    <p style={{ fontSize: "15px", fontWeight: "500" }}>{dept.manager}</p>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => editDepartment(dept)} style={{
                    flex: 1, padding: "10px", border: "none", borderRadius: "10px",
                    background: "#f59e0b", color: "white", cursor: "pointer", fontWeight: "600", fontSize: "13px",
                  }}>
                    Edit
                  </button>
                  <button onClick={() => deleteDepartment(dept.id)} style={{
                    flex: 1, padding: "10px", border: "none", borderRadius: "10px",
                    background: "#ef4444", color: "white", cursor: "pointer", fontWeight: "600", fontSize: "13px",
                  }}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  background: "#0f172a",
  border: "1px solid #1f2937",
  borderRadius: "12px",
  padding: "14px",
  color: "white",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  fontSize: "14px",
};

export default Departments;
