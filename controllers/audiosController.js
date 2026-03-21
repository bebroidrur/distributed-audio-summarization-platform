const audiosModel = require("../models/audiosModel");

function createAudio(req, res) {
    const { userId, title, filePath, duration } = req.body;

    if (!userId || !title || !filePath) {
        return res.status(400).json({
            error: "userId, title and filePath are required"
        });
    }

    audiosModel.createAudio(userId, title, filePath, duration, (err, audio) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.status(201).json(audio);
    });
}

function getAllAudios(req, res) {
    audiosModel.getAllAudios((err, audios) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(audios);
    });
}

function getAudioById(req, res) {
    const { id } = req.params;

    audiosModel.getAudioById(id, (err, audio) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (!audio) {
            return res.status(404).json({
                error: "Audio not found"
            });
        }

        res.json(audio);
    });
}

function updateAudio(req, res) {
    const { id } = req.params;
    const { userId, title, filePath, duration } = req.body;

    if (!userId || !title || !filePath) {
        return res.status(400).json({
            error: "userId, title and filePath are required"
        });
    }

    audiosModel.updateAudio(id, userId, title, filePath, duration, (err, changes) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (changes === 0) {
            return res.status(404).json({
                error: "Audio not found"
            });
        }

        res.json({
            message: "Audio updated successfully"
        });
    });
}

function deleteAudio(req, res) {
    const { id } = req.params;

    audiosModel.deleteAudio(id, (err, changes) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (changes === 0) {
            return res.status(404).json({
                error: "Audio not found"
            });
        }

        res.json({
            message: "Audio deleted successfully"
        });
    });
}

module.exports = {
    createAudio,
    getAllAudios,
    getAudioById,
    updateAudio,
    deleteAudio
};