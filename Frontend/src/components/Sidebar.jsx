import { NavLink } from "react-router-dom";

function Sidebar() {
  const menu = [
    "Dashboard",
    "Employees",
    "Departments",
    "LeaveManagement",
    "Approvals",
    "Reports",
  ];

  return (
    <div
      style={{
        width: "260px",
        background: "#111827",
        color: "white",
        minHeight: "100vh",
        padding: "25px",
      }}
    >
      <h1 style={{ marginBottom: "5px" }}>Staffing Suite</h1>

      <p style={{ color: "#9CA3AF" }}>
        Workforce Intelligence Platform
      </p>

      <hr style={{ borderColor: "#374151" }} />

      {menu.map((item) => (
        <NavLink
          key={item}
          to={item === "Dashboard" ? "/" : `/${item}`}
          style={{
            display: "block",
            color: "white",
            textDecoration: "none",
            padding: "12px 0",
          }}
        >
          {item}
        </NavLink>
      ))}
    </div>
  );
}

export default Sidebar;