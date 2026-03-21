const db = require("../database/db");

function createJob(audioId, status, callback) {
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const sql = `
    INSERT INTO jobs (audioId, status, createdAt, updatedAt)
    VALUES (?, ?, ?, ?)
  `;

    db.run(sql, [audioId, status, createdAt, updatedAt], function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null, {
                id: this.lastID,
                audioId,
                status,
                createdAt,
                updatedAt
            });
        }
    });
}

function getAllJobs(callback) {
    const sql = `SELECT * FROM jobs`;

    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
}

function getJobById(id, callback) {
    const sql = `SELECT * FROM jobs WHERE id = ?`;

    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function updateJob(id, audioId, status, callback) {
    const updatedAt = new Date().toISOString();

    const sql = `
    UPDATE jobs
    SET audioId = ?, status = ?, updatedAt = ?
    WHERE id = ?
  `;

    db.run(sql, [audioId, status, updatedAt, id], function (err) {
        callback(err, this.changes);
    });
}

function deleteJob(id, callback) {
    const sql = `DELETE FROM jobs WHERE id = ?`;

    db.run(sql, [id], function (err) {
        callback(err, this.changes);
    });
}

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob
};