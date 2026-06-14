const express = require("express");

const router = express.Router();

const {
  getLeaves,
  addLeave,
  approveLeave,
  rejectLeave,
} = require("../controllers/leaveController");

router.get("/", getLeaves);

router.post("/", addLeave);

router.put(
  "/approve/:id",
  approveLeave
);

router.put(
  "/reject/:id",
  rejectLeave
);

module.exports = router;