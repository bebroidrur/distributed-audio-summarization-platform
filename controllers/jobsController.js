const jobsModel = require("../models/jobsModel");

function createJob(req, res) {
    const { audioId, status } = req.body;
    const userId = req.userId;

    if (!audioId || !status) {
        return res.status(400).json({
            error: "audioId and status are required"
        });
    }

    jobsModel.createJob(audioId, userId, status, (err, job) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.status(201).json(job);
    });
}

function getAllJobs(req, res) {
    const userId = req.userId;

    jobsModel.getJobsByUser(userId, (err, jobs) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(jobs);
    });
}

function getJobById(req, res) {
    const { id } = req.params;
    const userId = req.userId;

    jobsModel.getJobByIdAndUser(id, userId, (err, job) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (!job) {
            return res.status(404).json({
                error: "Job not found or access denied"
            });
        }

        res.json(job);
    });
}

function updateJob(req, res) {
    const { id } = req.params;
    const { audioId, status } = req.body;
    const userId = req.userId;

    if (!audioId || !status) {
        return res.status(400).json({
            error: "audioId and status are required"
        });
    }

    jobsModel.updateJob(id, audioId, userId, status, (err, changes) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (changes === 0) {
            return res.status(404).json({
                error: "Job not found or access denied"
            });
        }

        res.json({
            message: "Job updated successfully"
        });
    });
}

function deleteJob(req, res) {
    const { id } = req.params;
    const userId = req.userId;

    jobsModel.deleteJob(id, userId, (err, changes) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (changes === 0) {
            return res.status(404).json({
                error: "Job not found or access denied"
            });
        }

        res.json({
            message: "Job deleted successfully"
        });
    });
}

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob
};