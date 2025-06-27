const express = require("express");
const router = express.Router();
const { getUserSessions } = require("../controllers/sessionController");
const { authMiddlewarec } = require("../controllers/authMiddlewarec");

router.get("/sessions", getUserSessions);

module.exports = router;
//getUserSessions