const express = require("express");
const router = express.Router();
const { runCommandVulnerable, runCommandSecure } = require("../controllers/osInjectionController");

router.post("/run-vulnerable", runCommandVulnerable); // Уязвимый
router.post("/run-secure", runCommandSecure); // Защищённый

module.exports = router;
