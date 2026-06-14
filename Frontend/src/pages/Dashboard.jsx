import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
} from "recharts";

function Dashboard() {
  const [stats, setStats] = useState({
    employees: 0,
    departments: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
  });

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/dashboard");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const pieData = [
    { name: "Employees",       value: Number(stats.employees) },
    { name: "Departments",     value: Number(stats.departments) },
    { name: "Pending Leaves",  value: Number(stats.pendingLeaves) },
    { name: "Approved Leaves", value: Number(stats.approvedLeaves) },
  ];

  const COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#22c55e"];

  const statCards = [
    { label: "Total Employees",  value: stats.employees,     icon: "👥", badge: "Active workforce", color: "#3b82f6", bg: "#1e3a5f" },
    { label: "Departments",      value: stats.departments,   icon: "🏢", badge: "Teams active",     color: "#8b5cf6", bg: "#2e1f5e" },
    { label: "Pending Leaves",   value: stats.pendingLeaves, icon: "⏳", badge: "Needs review",     color: "#f59e0b", bg: "#3b2a0a" },
    { label: "Approved Leaves",  value: stats.approvedLeaves,icon: "✅", badge: "This month",       color: "#22c55e", bg: "#14532d" },
  ];

  const tasks = [
    { label: "Review Leave Requests", done: true },
    { label: "Add New Employees",     done: true },
    { label: "Department Planning",   done: true },
    { label: "Workforce Audit",       done: false },
    { label: "Generate Reports",      done: false },
  ];

  const activities = [
    { initials: "SK", label: "Employee records updated",          time: "2 minutes ago",  color: "#3b82f6", bg: "#1e3a5f" },
    { initials: "DR", label: "Department records synced",         time: "18 minutes ago", color: "#8b5cf6", bg: "#2e1f5e" },
    { initials: "MK", label: "Leave request submitted",           time: "1 hour ago",     color: "#f59e0b", bg: "#3b2a0a" },
    { initials: "DB", label: "Dashboard connected with PostgreSQL",time: "Today, 9:00 AM",color: "#22c55e", bg: "#14532d" },
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
        <button
          onClick={logout}
          style={{
            marginTop: "40px", width: "100%", padding: "12px",
            border: "none", borderRadius: "10px",
            background: "#ef4444", color: "white", cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* ── Main ── */}
      <div className="main">

        {/* Header */}
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ fontSize: "42px", marginBottom: "6px" }}>Dashboard Overview</h1>
          <p style={{ color: "#94a3b8" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            &nbsp;·&nbsp; Welcome back, Admin
          </p>
        </div>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "20px", marginBottom: "25px" }}>
          {statCards.map((s) => (
            <div key={s.label} style={{
              background: "#111827", border: "1px solid #1f2937",
              borderRadius: "20px", padding: "24px",
            }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "12px",
                background: s.bg, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "20px", marginBottom: "16px",
              }}>
                {s.icon}
              </div>
              <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "6px" }}>{s.label}</p>
              <h1 style={{ fontSize: "36px", fontWeight: "700", margin: "0 0 10px" }}>{s.value}</h1>
              <span style={{
                fontSize: "12px", padding: "4px 10px", borderRadius: "20px",
                background: s.bg, color: s.color,
              }}>
                {s.badge}
              </span>
            </div>
          ))}
        </div>

        {/* Middle Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>

          {/* Tasks */}
          <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "20px", padding: "24px" }}>
            <h3 style={{ marginBottom: "16px" }}>Daily Tasks</h3>
            {tasks.map((t) => (
              <div key={t.label} style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "10px 0", borderBottom: "1px solid #1f2937",
                color: "#94a3b8", fontSize: "14px",
              }}>
                <div style={{
                  width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0,
                  background: t.done ? "#22c55e" : "#374151",
                }} />
                <span style={{ color: t.done ? "white" : "#6b7280" }}>{t.label}</span>
                {t.done && <span style={{ marginLeft: "auto", fontSize: "12px", color: "#22c55e" }}>Done</span>}
              </div>
            ))}
          </div>

          {/* Pie / Donut Chart */}
          <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "20px", padding: "24px" }}>
            <h3 style={{ marginBottom: "8px" }}>Workforce Analytics</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#111827", border: "1px solid #1f2937",
                    borderRadius: "10px", color: "white",
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "13px", color: "#94a3b8" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

          {/* Recent Activity */}
          <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "20px", padding: "24px" }}>
            <h3 style={{ marginBottom: "16px" }}>Recent Activity</h3>
            {activities.map((a) => (
              <div key={a.label} style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "12px 0", borderBottom: "1px solid #1f2937",
              }}>
                <div style={{
                  width: "38px", height: "38px", borderRadius: "50%",
                  background: a.bg, color: a.color, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", fontWeight: "600",
                }}>
                  {a.initials}
                </div>
                <div>
                  <p style={{ fontSize: "14px", color: "white", margin: 0 }}>{a.label}</p>
                  <p style={{ fontSize: "12px", color: "#4b5563", marginTop: "3px" }}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Department Strength */}
          <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "20px", padding: "24px" }}>
            <h3 style={{ marginBottom: "20px" }}>Department Strength</h3>
            {[
              { label: "IT",      val: 8, color: "#3b82f6" },
              { label: "HR",      val: 5, color: "#8b5cf6" },
              { label: "Finance", val: 4, color: "#f59e0b" },
              { label: "Sales",   val: 3, color: "#22c55e" },
              { label: "Design",  val: 2, color: "#ec4899" },
            ].map((d) => (
              <div key={d.label} style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "13px", color: "#94a3b8" }}>{d.label}</span>
                  <span style={{ fontSize: "13px", color: d.color, fontWeight: "600" }}>{d.val}</span>
                </div>
                <div style={{ height: "6px", background: "#1f2937", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{
                    width: `${(d.val / 10) * 100}%`, height: "100%",
                    background: d.color, borderRadius: "3px",
                  }} />
                </div>
              </div>
            ))}
            <p style={{ fontSize: "11px", color: "#4b5563", marginTop: "8px", paddingTop: "12px", borderTop: "1px solid #1f2937" }}>
              * Sample data — connect your DB for live department counts
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
