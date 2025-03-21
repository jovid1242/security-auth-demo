const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/authMiddleware");
const ipFilter = require("../middlewares/ipFilterMiddeware");

router.get("/dashboard", authenticate, ipFilter, (req, res) => {
    res.json({ message: `Hello, ${req.user.username}! Welcome to your dashboard.` });
});
 
router.get("/admin", authenticate, authorize("admin"), ipFilter, (req, res) => {
    res.json({ message: `Hello, Admin ${req.user.username}!` });
});

module.exports = router;
