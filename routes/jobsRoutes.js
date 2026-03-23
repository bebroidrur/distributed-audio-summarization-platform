const express = require("express");
const router = express.Router();

const jobsController = require("../controllers/jobsController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, jobsController.getAllJobs);
router.get("/:id", authMiddleware, jobsController.getJobById);
router.post("/", authMiddleware, jobsController.createJob);
router.put("/:id", authMiddleware, jobsController.updateJob);
router.delete("/:id", authMiddleware, jobsController.deleteJob);

module.exports = router;