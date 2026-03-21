const summariesModel = require("../models/summariesModel");

function createSummary(req, res) {
    const { jobId, content } = req.body;

    if (!jobId || !content) {
        return res.status(400).json({
            error: "jobId and content are required"
        });
    }

    summariesModel.createSummary(jobId, content, (err, summary) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.status(201).json(summary);
    });
}

function getAllSummaries(req, res) {
    summariesModel.getAllSummaries((err, summaries) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(summaries);
    });
}

function getSummaryById(req, res) {
    const { id } = req.params;

    summariesModel.getSummaryById(id, (err, summary) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (!summary) {
            return res.status(404).json({
                error: "Summary not found"
            });
        }

        res.json(summary);
    });
}

function updateSummary(req, res) {
    const { id } = req.params;
    const { jobId, content } = req.body;

    if (!jobId || !content) {
        return res.status(400).json({
            error: "jobId and content are required"
        });
    }

    summariesModel.updateSummary(id, jobId, content, (err, changes) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (changes === 0) {
            return res.status(404).json({
                error: "Summary not found"
            });
        }

        res.json({
            message: "Summary updated successfully"
        });
    });
}

function deleteSummary(req, res) {
    const { id } = req.params;

    summariesModel.deleteSummary(id, (err, changes) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (changes === 0) {
            return res.status(404).json({
                error: "Summary not found"
            });
        }

        res.json({
            message: "Summary deleted successfully"
        });
    });
}

module.exports = {
    createSummary,
    getAllSummaries,
    getSummaryById,
    updateSummary,
    deleteSummary
};