require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employee");
const departmentRoutes = require("./routes/department");
const leaveRoutes = require("./routes/leave");
const dashboardRoutes = require("./routes/dashboard");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/employees",
  employeeRoutes
);

app.use(
  "/api/departments",
  departmentRoutes
);

app.use(
  "/api/leaves",
  leaveRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.get("/", (req, res) => {
  res.send(
    "Staffing Suite Backend Running 🚀"
  );
});

app.listen(
  process.env.PORT,
  () => {
    console.log(
      `Server Running On Port ${process.env.PORT}`
    );
  }
);