const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
});

router.get("/", getEmployees);

router.post(
  "/",
  upload.single("photo"),
  addEmployee
);

router.put(
  "/:id",
  upload.single("photo"),
  updateEmployee
);

router.delete("/:id", deleteEmployee);

module.exports = router;