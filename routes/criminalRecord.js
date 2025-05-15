const express = require("express");
const router = express.Router();
const criminalRecordController = require("../controllers/criminalRecordController");

router.post("/", criminalRecordController.createRecord);
router.get("/", criminalRecordController.getAllRecords);
router.delete("/:id", criminalRecordController.deleteRecord);

module.exports = router;
