const express = require("express");
const router = express.Router();

const summariesController = require("../controllers/summariesController");

router.post("/", summariesController.createSummary);
router.get("/", summariesController.getAllSummaries);
router.get("/:id", summariesController.getSummaryById);
router.put("/:id", summariesController.updateSummary);
router.delete("/:id", summariesController.deleteSummary);

module.exports = router;