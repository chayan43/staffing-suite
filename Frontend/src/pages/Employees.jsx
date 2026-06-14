import { useEffect, useState } from "react";
import axios from "axios";

function generateEmployeeId() {
  const prefix = "EMP";
  const random = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${random}`;
}

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    employee_id: generateEmployeeId(),
    fullname: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    salary: "",
    address: "",
    skills: [],
  });

  const skillOptions = [
    "React", "Node.js", "PostgreSQL", "JavaScript",
    "HTML", "CSS", "MongoDB", "Python", "Testing", "Salesforce",
  ];

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://staffing-suite.onrender.com/api/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Could not load employees: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      // Send all fields — backend can choose to use employee_id or ignore it
      formData.append("employee_id", form.employee_id);
      formData.append("fullname", form.fullname);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("department", form.department);
      formData.append("designation", form.designation);
      formData.append("salary", form.salary);
      formData.append("address", form.address);
      formData.append("skills", form.skills.join(", "));
      if (selectedFile) formData.append("photo", selectedFile);

      // DEBUG: log what we're sending
      console.log("Submitting form data:");
      for (let [key, val] of formData.entries()) {
        console.log(`  ${key}:`, val);
      }

      if (editingId) {
        await axios.put(`http://staffing-suite.onrender.com/api/employees/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Employee Updated");
      } else {
        await axios.post("http://staffing-suite.onrender.com/api/employees", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Employee Added");
      }

      // Reset form
      setForm({
        employee_id: generateEmployeeId(),
        fullname: "", email: "", phone: "",
        department: "", designation: "",
        salary: "", address: "", skills: [],
      });
      setSelectedFile(null);
      setEditingId(null);
      fetchEmployees();

    } catch (err) {
      console.error("Submit error:", err);
      // Show the actual backend error message if available
      const msg = err.response?.data?.message || err.message || "Unknown error";
      alert("❌ Operation Failed: " + msg);
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await axios.delete(`http://staffing-suite.onrender.com/api/employees/${id}`);
      fetchEmployees();
      alert("✅ Employee Deleted");
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Delete Failed: " + (err.response?.data?.message || err.message));
    }
  };

  const editEmployee = (employee) => {
    setEditingId(employee.id);
    setForm({
      employee_id: employee.employee_id || generateEmployeeId(),
      fullname: employee.fullname || "",
      email: employee.email || "",
      phone: employee.phone || "",
      department: employee.department || "",
      designation: employee.designation || "",
      salary: employee.salary || "",
      address: employee.address || "",
      skills: employee.skills ? employee.skills.split(", ") : [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setSelectedFile(null);
    setForm({
      employee_id: generateEmployeeId(),
      fullname: "", email: "", phone: "",
      department: "", designation: "",
      salary: "", address: "", skills: [],
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
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

      {/* ── Main Content ── */}
      <div className="main">

        <h1 style={{ fontSize: "42px", marginBottom: "10px" }}>Employee Directory</h1>
        <p style={{ color: "#94a3b8", marginBottom: "30px" }}>Manage Employees Professionally</p>

        {/* Form Card */}
        <div style={{
          background: "#111827", padding: "25px",
          borderRadius: "20px", border: "1px solid #1f2937", marginBottom: "30px",
        }}>
          <h2 style={{ marginBottom: "20px" }}>
            {editingId ? "✏️ Edit Employee" : "➕ Add Employee"}
          </h2>

          {/* Employee ID banner */}
          <div style={{
            marginBottom: "20px", background: "#0f172a",
            border: "1px solid #1f2937", borderRadius: "12px",
            padding: "14px 18px", display: "flex", alignItems: "center", gap: "12px",
          }}>
            <span style={{ color: "#94a3b8", fontSize: "14px" }}>Employee ID:</span>
            <span style={{ color: "#38bdf8", fontWeight: "700", fontSize: "16px", letterSpacing: "1px" }}>
              {form.employee_id}
            </span>
            {!editingId && (
              <button
                onClick={() => setForm({ ...form, employee_id: generateEmployeeId() })}
                style={{
                  marginLeft: "auto", padding: "6px 14px",
                  background: "#1e293b", border: "1px solid #334155",
                  borderRadius: "8px", color: "#94a3b8", cursor: "pointer", fontSize: "12px",
                }}
              >
                Regenerate
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "15px" }}
          >
            <input
              required
              placeholder="Full Name"
              value={form.fullname}
              onChange={(e) => setForm({ ...form, fullname: e.target.value })}
              style={inputStyle}
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={inputStyle}
            />
            <input
              required
              placeholder="Department"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              style={inputStyle}
            />
            <input
              required
              placeholder="Designation"
              value={form.designation}
              onChange={(e) => setForm({ ...form, designation: e.target.value })}
              style={inputStyle}
            />
            <input
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              style={inputStyle}
            />
            <input
              placeholder="Salary"
              value={form.salary}
              onChange={(e) => setForm({ ...form, salary: e.target.value })}
              style={inputStyle}
            />
            <textarea
              placeholder="Address"
              value={form.address}
              rows={3}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              style={{ ...inputStyle, gridColumn: "span 2", resize: "vertical", fontFamily: "inherit" }}
            />

            {/* Skills */}
            <div style={{
              gridColumn: "span 2", background: "#0f172a",
              padding: "15px", borderRadius: "12px", border: "1px solid #1f2937",
            }}>
              <h3 style={{ marginBottom: "10px" }}>Employee Skills</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "10px" }}>
                {skillOptions.map((skill) => (
                  <label key={skill} style={{ display: "flex", gap: "8px", alignItems: "center", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={form.skills.includes(skill)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setForm({ ...form, skills: [...form.skills, skill] });
                        } else {
                          setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });
                        }
                      }}
                    />
                    {skill}
                  </label>
                ))}
              </div>
            </div>

            {/* Photo Upload */}
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#94a3b8" }}>
                Upload Employee Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                style={{ width: "100%", color: "white" }}
              />
              {selectedFile && (
                <p style={{ marginTop: "6px", color: "#38bdf8", fontSize: "13px" }}>
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <button
              type="submit"
              disabled={loading}
              style={{
                gridColumn: editingId ? "1" : "span 2",
                padding: "14px", border: "none",
                borderRadius: "12px", background: loading ? "#1e40af" : "#2563eb",
                color: "white", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Processing..." : editingId ? "Update Employee" : "Add Employee"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                style={{
                  gridColumn: "2", padding: "14px", border: "1px solid #334155",
                  borderRadius: "12px", background: "transparent",
                  color: "#94a3b8", fontWeight: "600", cursor: "pointer",
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* Employee Count */}
        <p style={{ color: "#94a3b8", marginBottom: "16px" }}>
          {employees.length} employee{employees.length !== 1 ? "s" : ""} found
        </p>

        {/* Employee Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
          gap: "20px",
        }}>
          {employees.length === 0 && (
            <p style={{ color: "#475569", gridColumn: "1/-1", textAlign: "center", padding: "40px" }}>
              No employees yet. Add one above!
            </p>
          )}

          {employees.map((emp) => (
            <div key={emp.id} style={{
              background: "#111827", border: "1px solid #1f2937",
              borderRadius: "20px", padding: "20px",
            }}>
              {/* EMP ID badge */}
              <div style={{
                marginBottom: "12px", display: "inline-block",
                background: "#1e293b", color: "#38bdf8",
                padding: "4px 10px", borderRadius: "8px",
                fontSize: "12px", fontWeight: "600", letterSpacing: "0.5px",
              }}>
                {emp.employee_id || "EMP-XXXXXX"}
              </div>

              <img
                src={emp.photo || `https://i.pravatar.cc/150?u=${emp.id}`}
                alt={emp.fullname}
                style={{
                  width: "90px", height: "90px", borderRadius: "50%",
                  objectFit: "cover", marginBottom: "15px", display: "block",
                }}
                onError={(e) => { e.target.src = `https://i.pravatar.cc/150?u=${emp.id}`; }}
              />

              <h2>{emp.fullname}</h2>
              <p style={{ color: "#94a3b8", marginTop: "5px" }}>{emp.designation}</p>
              <p style={{ marginTop: "10px" }}>{emp.email}</p>

              {emp.phone && (
                <p style={{ marginTop: "6px", color: "#94a3b8", fontSize: "14px" }}>
                  📞 {emp.phone}
                </p>
              )}
              {emp.address && (
                <p style={{ marginTop: "6px", color: "#94a3b8", fontSize: "14px" }}>
                  📍 {emp.address}
                </p>
              )}

              <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <div style={{
                  background: "#1e293b", color: "#38bdf8",
                  padding: "8px 12px", borderRadius: "20px",
                }}>
                  {emp.department}
                </div>
                {emp.salary && (
                  <div style={{
                    background: "#14532d", color: "#86efac",
                    padding: "8px 12px", borderRadius: "20px", fontWeight: "600",
                  }}>
                    💰 {emp.salary}
                  </div>
                )}
              </div>

              {emp.skills && (
                <div style={{ marginTop: "15px" }}>
                  <strong>Skills:</strong>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
                    {emp.skills.split(", ").filter(Boolean).map((skill, index) => (
                      <span key={index} style={{
                        background: "#065f46", color: "#6ee7b7",
                        padding: "6px 12px", borderRadius: "20px", fontSize: "13px",
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button onClick={() => editEmployee(emp)} style={{
                  flex: 1, padding: "10px", border: "none",
                  borderRadius: "10px", background: "#f59e0b",
                  color: "white", cursor: "pointer", fontWeight: "600",
                }}>
                  Edit
                </button>
                <button onClick={() => deleteEmployee(emp.id)} style={{
                  flex: 1, padding: "10px", border: "none",
                  borderRadius: "10px", background: "#ef4444",
                  color: "white", cursor: "pointer", fontWeight: "600",
                }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
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
};

export default Employees;
