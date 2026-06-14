const pool = require("../config/db");

const getStats = async (req, res) => {
  try {
    const employees = await pool.query(
      "SELECT COUNT(*) FROM employees"
    );

    const departments = await pool.query(
      "SELECT COUNT(*) FROM departments"
    );

    const pendingLeaves = await pool.query(
      "SELECT COUNT(*) FROM leave_requests WHERE status='Pending'"
    );

    const approvedLeaves = await pool.query(
      "SELECT COUNT(*) FROM leave_requests WHERE status='Approved'"
    );

    res.json({
      employees: employees.rows[0].count,
      departments: departments.rows[0].count,
      pendingLeaves: pendingLeaves.rows[0].count,
      approvedLeaves: approvedLeaves.rows[0].count,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getStats,
};