import { useEffect, useState } from "react";
import axios from "axios";

function LeaveManagement() {
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({
    employee_name: "",
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
  });

  const fetchLeaves = async () => {
    try {
      const res = await axios.get("http://staffing-suite.onrender.com/api/leaves");
      setLeaves(res.data);
    } catch (err) { console.log(err); }
  };

  useEffect(() => { fetchLeaves(); }, []);

  const addLeave = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://staffing-suite.onrender.com/api/leaves", form);
      setForm({ employee_name: "", leave_type: "", start_date: "", end_date: "", reason: "" });
      fetchLeaves();
      alert("✅ Leave Request Submitted");
    } catch (err) { console.log(err); }
  };

  const approveLeave = async (id) => {
    try {
      await axios.put(`http://staffing-suite.onrender.com/api/leaves/approve/${id}`);
      fetchLeaves();
    } catch (err) { console.log(err); }
  };

  const rejectLeave = async (id) => {
    try {
      await axios.put(`http://staffing-suite.onrender.com/api/leaves/reject/${id}`);
      fetchLeaves();
    } catch (err) { console.log(err); }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const leaveTypeIcon = (type) => {
    const t = (type || "").toLowerCase();
    if (t.includes("sick")) return "🤒";
    if (t.includes("casual")) return "🌴";
    if (t.includes("maternity") || t.includes("paternity")) return "👶";
    if (t.includes("annual")) return "✈️";
    return "📋";
  };

  const statusStyle = (status) => {
    if (status === "Approved") return { bg: "#14532d", color: "#22c55e", icon: "✅" };
    if (status === "Rejected") return { bg: "#3a1a1a", color: "#ef4444", icon: "❌" };
    return { bg: "#3b2a0a", color: "#f59e0b", icon: "⏳" };
  };

  const filteredLeaves = filter === "All" ? leaves : leaves.filter(l => l.status === filter);

  const counts = {
    All: leaves.length,
    Pending: leaves.filter(l => l.status === "Pending").length,
    Approved: leaves.filter(l => l.status === "Approved").length,
    Rejected: leaves.filter(l => l.status === "Rejected").length,
  };

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
        <h1 style={{ fontSize: "42px", marginBottom: "10px" }}>Leave Management</h1>
        <p style={{ color: "#94a3b8", marginBottom: "30px" }}>Review and Manage Employee Leave Requests</p>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "28px" }}>
          {[
            { label: "Total Requests", count: counts.All,      bg: "#1e3a5f", color: "#3b82f6", icon: "📋" },
            { label: "Pending",        count: counts.Pending,  bg: "#3b2a0a", color: "#f59e0b", icon: "⏳" },
            { label: "Approved",       count: counts.Approved, bg: "#14532d", color: "#22c55e", icon: "✅" },
            { label: "Rejected",       count: counts.Rejected, bg: "#3a1a1a", color: "#ef4444", icon: "❌" },
          ].map((s) => (
            <div key={s.label} style={{
              background: "#111827", border: "1px solid #1f2937",
              borderRadius: "20px", padding: "20px",
            }}>
              <div style={{
                width: "42px", height: "42px", borderRadius: "12px",
                background: s.bg, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "18px", marginBottom: "12px",
              }}>
                {s.icon}
              </div>
              <p style={{ color: "#94a3b8", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>{s.label}</p>
              <p style={{ fontSize: "28px", fontWeight: "700", color: s.color }}>{s.count}</p>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div style={{
          background: "#111827", padding: "28px",
          borderRadius: "20px", border: "1px solid #1f2937", marginBottom: "28px",
        }}>
          <h2 style={{ marginBottom: "20px", fontSize: "18px" }}>📝 Submit Leave Request</h2>
          <form onSubmit={addLeave} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <input
              required
              placeholder="Employee Name"
              value={form.employee_name}
              onChange={(e) => setForm({ ...form, employee_name: e.target.value })}
              style={inputStyle}
            />
            <input
              required
              placeholder="Leave Type (e.g. Casual, Sick, Annual)"
              value={form.leave_type}
              onChange={(e) => setForm({ ...form, leave_type: e.target.value })}
              style={inputStyle}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", color: "#94a3b8" }}>Start Date</label>
              <input
                required
                type="date"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", color: "#94a3b8" }}>End Date</label>
              <input
                required
                type="date"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                style={inputStyle}
              />
            </div>
            <textarea
              required
              placeholder="Reason for leave..."
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              rows={3}
              style={{ ...inputStyle, gridColumn: "span 2", resize: "vertical", fontFamily: "inherit" }}
            />
            <button type="submit" style={{
              gridColumn: "span 2", padding: "14px", border: "none",
              borderRadius: "12px", background: "#2563eb", color: "white",
              fontWeight: "600", cursor: "pointer", fontSize: "15px",
            }}>
              Submit Leave Request
            </button>
          </form>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          {["All", "Pending", "Approved", "Rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "8px 20px", border: "1px solid",
                borderRadius: "20px", cursor: "pointer", fontSize: "13px", fontWeight: "600",
                borderColor: filter === f ? "#2563eb" : "#1f2937",
                background: filter === f ? "#2563eb" : "#111827",
                color: filter === f ? "white" : "#94a3b8",
              }}
            >
              {f} ({counts[f]})
            </button>
          ))}
        </div>

        {/* Leave Cards */}
        <div style={{ display: "grid", gap: "16px" }}>
          {filteredLeaves.length === 0 && (
            <div style={{
              background: "#111827", border: "1px solid #1f2937",
              borderRadius: "20px", padding: "40px", textAlign: "center", color: "#475569",
            }}>
              No {filter !== "All" ? filter.toLowerCase() : ""} leave requests found.
            </div>
          )}
          {filteredLeaves.map((leave) => {
            const s = statusStyle(leave.status);
            return (
              <div key={leave.id} style={{
                background: "#111827", border: "1px solid #1f2937",
                borderRadius: "20px", padding: "24px",
                display: "grid", gridTemplateColumns: "1fr auto",
                gap: "20px", alignItems: "start",
              }}>
                {/* Left side */}
                <div>
                  {/* Header */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <div style={{
                      width: "46px", height: "46px", borderRadius: "50%",
                      background: "#1e3a5f", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: "18px", flexShrink: 0,
                    }}>
                      {leave.employee_name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <h3 style={{ fontSize: "17px", fontWeight: "600", marginBottom: "4px" }}>
                        {leave.employee_name}
                      </h3>
                      <span style={{ fontSize: "13px", color: "#94a3b8" }}>
                        {leaveTypeIcon(leave.leave_type)} {leave.leave_type}
                      </span>
                    </div>
                  </div>

                  {/* Info pills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "14px" }}>
                    <span style={{ background: "#0f172a", border: "1px solid #1f2937", color: "#94a3b8", padding: "6px 12px", borderRadius: "20px", fontSize: "13px" }}>
                      📅 {leave.start_date?.substring(0, 10)} → {leave.end_date?.substring(0, 10)}
                    </span>
                    <span style={{
                      background: s.bg, color: s.color,
                      padding: "6px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "600",
                    }}>
                      {s.icon} {leave.status}
                    </span>
                  </div>

                  {/* Reason */}
                  <div style={{
                    background: "#0f172a", border: "1px solid #1f2937",
                    borderRadius: "12px", padding: "12px 16px",
                  }}>
                    <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>REASON</p>
                    <p style={{ fontSize: "14px", color: "#e2e8f0" }}>{leave.reason}</p>
                  </div>
                </div>

                {/* Right side — actions */}
                {leave.status === "Pending" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "120px" }}>
                    <button onClick={() => approveLeave(leave.id)} style={{
                      padding: "10px 20px", border: "none", borderRadius: "10px",
                      background: "#14532d", color: "#22c55e", cursor: "pointer",
                      fontWeight: "600", fontSize: "14px",
                    }}>
                      ✅ Approve
                    </button>
                    <button onClick={() => rejectLeave(leave.id)} style={{
                      padding: "10px 20px", border: "none", borderRadius: "10px",
                      background: "#3a1a1a", color: "#ef4444", cursor: "pointer",
                      fontWeight: "600", fontSize: "14px",
                    }}>
                      ❌ Reject
                    </button>
                  </div>
                )}
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

export default LeaveManagement;
