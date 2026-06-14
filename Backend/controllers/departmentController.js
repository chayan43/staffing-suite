const pool = require("../config/db");

const getDepartments = async (req, res) => {
  try {
    const departments = await pool.query(
      "SELECT * FROM departments ORDER BY id DESC"
    );

    res.json(departments.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const addDepartment = async (req, res) => {
  try {
    const { name, manager } = req.body;

    const department = await pool.query(
      `INSERT INTO departments
      (name,manager)
      VALUES($1,$2)
      RETURNING *`,
      [name, manager]
    );

    res.status(201).json(
      department.rows[0]
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, manager } = req.body;

    const department = await pool.query(
      `UPDATE departments
       SET name=$1,
           manager=$2
       WHERE id=$3
       RETURNING *`,
      [name, manager, id]
    );

    res.json(department.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM departments WHERE id=$1",
      [id]
    );

    res.json({
      message: "Department Deleted",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
};