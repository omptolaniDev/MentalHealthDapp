// routes/admin.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Admin-only route
router.get("/dashboard", authMiddleware(["admin"]), async (req, res) => {
  res.json({ message: `Admin Panel for ${req.user.wallet}` });
});

module.exports = router;
