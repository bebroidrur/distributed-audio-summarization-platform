const db = require("../database/db");

function createJob(audioId, userId, status, callback) {
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const sql = `
        INSERT INTO jobs (audioId, userId, status, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(sql, [audioId, userId, status, createdAt, updatedAt], function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null, {
                id: this.lastID,
                audioId,
                userId,
                status,
                createdAt,
                updatedAt
            });
        }
    });
}

function getJobsByUser(userId, callback) {
    const sql = `SELECT * FROM jobs WHERE userId = ?`;

    db.all(sql, [userId], (err, rows) => {
        callback(err, rows);
    });
}

function getJobByIdAndUser(id, userId, callback) {
    const sql = `SELECT * FROM jobs WHERE id = ? AND userId = ?`;

    db.get(sql, [id, userId], (err, row) => {
        callback(err, row);
    });
}

function updateJob(id, audioId, userId, status, callback) {
    const updatedAt = new Date().toISOString();

    const sql = `
        UPDATE jobs
        SET audioId = ?, status = ?, updatedAt = ?
        WHERE id = ? AND userId = ?
    `;

    db.run(sql, [audioId, status, updatedAt, id, userId], function (err) {
        callback(err, this.changes);
    });
}

function deleteJob(id, userId, callback) {
    const sql = `DELETE FROM jobs WHERE id = ? AND userId = ?`;

    db.run(sql, [id, userId], function (err) {
        callback(err, this.changes);
    });
}

module.exports = {
    createJob,
    getJobsByUser,
    getJobByIdAndUser,
    updateJob,
    deleteJob
};