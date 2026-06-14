const pool = require("../config/db");

const getLeaves = async (req, res) => {
  try {
    const leaves = await pool.query(
      "SELECT * FROM leave_requests ORDER BY id DESC"
    );

    res.json(leaves.rows);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const addLeave = async (req, res) => {
  try {
    const {
      employee_name,
      leave_type,
      start_date,
      end_date,
      reason,
    } = req.body;

    const leave = await pool.query(
      `INSERT INTO leave_requests
      (employee_name,leave_type,start_date,end_date,reason)
      VALUES($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        employee_name,
        leave_type,
        start_date,
        end_date,
        reason,
      ]
    );

    res.status(201).json(
      leave.rows[0]
    );
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const approveLeave = async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await pool.query(
      `UPDATE leave_requests
       SET status='Approved'
       WHERE id=$1
       RETURNING *`,
      [id]
    );

    res.json(leave.rows[0]);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const rejectLeave = async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await pool.query(
      `UPDATE leave_requests
       SET status='Rejected'
       WHERE id=$1
       RETURNING *`,
      [id]
    );

    res.json(leave.rows[0]);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getLeaves,
  addLeave,
  approveLeave,
  rejectLeave,
};