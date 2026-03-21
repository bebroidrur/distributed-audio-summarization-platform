const db = require("../database/db");

function createAudio(userId, title, filePath, duration, callback) {
    const uploadedAt = new Date().toISOString();

    const sql = `
    INSERT INTO audios (userId, title, filePath, duration, uploadedAt)
    VALUES (?, ?, ?, ?, ?)
  `;

    db.run(sql, [userId, title, filePath, duration, uploadedAt], function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null, {
                id: this.lastID,
                userId,
                title,
                filePath,
                duration,
                uploadedAt
            });
        }
    });
}

function getAllAudios(callback) {
    const sql = `SELECT * FROM audios`;

    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
}

function getAudioById(id, callback) {
    const sql = `SELECT * FROM audios WHERE id = ?`;

    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function updateAudio(id, userId, title, filePath, duration, callback) {
    const sql = `
    UPDATE audios
    SET userId = ?, title = ?, filePath = ?, duration = ?
    WHERE id = ?
  `;

    db.run(sql, [userId, title, filePath, duration, id], function (err) {
        callback(err, this.changes);
    });
}

function deleteAudio(id, callback) {
    const sql = `DELETE FROM audios WHERE id = ?`;

    db.run(sql, [id], function (err) {
        callback(err, this.changes);
    });
}

module.exports = {
    createAudio,
    getAllAudios,
    getAudioById,
    updateAudio,
    deleteAudio
};