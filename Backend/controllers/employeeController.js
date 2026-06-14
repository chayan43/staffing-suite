const pool = require("../config/db");

const getEmployees = async (req, res) => {
  try {
    const employees = await pool.query(
      "SELECT * FROM employees ORDER BY id DESC"
    );
    res.json(employees.rows);
  } catch (err) {
    console.error("GET EMPLOYEES ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

const addEmployee = async (req, res) => {
  try {
    const {
      fullname,
      email,
      department,
      designation,
      skills,
      phone,
      address,
      salary,
    } = req.body;

    // Use frontend employee_id if sent, else generate
    const employee_id =
      req.body.employee_id ||
      "EMP-" + Math.floor(100000 + Math.random() * 900000).toString();

    const photo = req.file
      ? `http://staffing-suite.onrender.com/uploads/${req.file.filename}`
      : null;

    console.log("ADD - req.body:", req.body);
    console.log("ADD - req.file:", req.file);

    const employee = await pool.query(
      `INSERT INTO employees
        (employee_id, fullname, email, department, designation, phone, address, salary, skills, photo)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [employee_id, fullname, email, department, designation,
       phone || null, address || null, salary || null, skills || null, photo]
    );

    res.status(201).json(employee.rows[0]);
  } catch (err) {
    console.error("ADD EMPLOYEE ERROR:", err);
    res.status(500).json({ message: err.message, detail: err.detail || null });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      fullname,
      email,
      department,
      designation,
      skills,
      phone,
      address,
      salary,
    } = req.body;

    console.log("UPDATE - req.body:", req.body);
    console.log("UPDATE - req.file:", req.file);
    console.log("UPDATE - id:", id);

    // If new file uploaded use it, else keep existing photo from DB
    let photo;
    if (req.file) {
      photo = `http://staffing-suite.onrender.com/uploads/${req.file.filename}`;
    } else {
      // Fetch current photo from DB so we don't overwrite with null
      const current = await pool.query(
        "SELECT photo FROM employees WHERE id=$1", [id]
      );
      photo = current.rows[0]?.photo || null;
    }

    const employee = await pool.query(
      `UPDATE employees
       SET fullname=$1,
           email=$2,
           department=$3,
           designation=$4,
           phone=$5,
           address=$6,
           salary=$7,
           skills=$8,
           photo=$9
       WHERE id=$10
       RETURNING *`,
      [
        fullname,
        email,
        department,
        designation,
        phone || null,
        address || null,
        salary || null,
        skills || null,
        photo,
        id,
      ]
    );

    if (employee.rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee.rows[0]);
  } catch (err) {
    console.error("UPDATE EMPLOYEE ERROR:", err);
    res.status(500).json({ message: err.message, detail: err.detail || null });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM employees WHERE id=$1", [id]);
    res.json({ message: "Employee Deleted" });
  } catch (err) {
    console.error("DELETE EMPLOYEE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};