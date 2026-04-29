const jobsModel = require("../models/jobsModel");
const rabbitmqService = require("../services/rabbitmqService");
const { getObject } = require("../services/s3Service");

async function getJobResult(req, res) {
    const { id } = req.params;

    jobsModel.getJobByIdAndUser(id, req.userId, async (err, job) => {
        if (err) return res.status(500).json({ error: err.message });

        if (!job || !job.s3Key) {
            return res.status(404).json({ error: "Result not ready" });
        }

        try {
            const data = await getObject(job.s3Key);
            res.json(JSON.parse(data));
        } catch (e) {
            res.status(500).json({ error: "Failed to load result" });
        }
    });
}

function createJob(req, res) {
    const { audioId } = req.body;
    const userId = req.userId;

    const status = "QUEUED";

    jobsModel.createJob(audioId, userId, status, (err, job) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        rabbitmqService.publishTranscriptionRequest(job);

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