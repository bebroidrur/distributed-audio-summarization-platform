const db = require("../database/db");

function createSummary(jobId, content, callback) {
    const createdAt = new Date().toISOString();

    const sql = `
    INSERT INTO summaries (jobId, content, createdAt)
    VALUES (?, ?, ?)
  `;

    db.run(sql, [jobId, content, createdAt], function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null, {
                id: this.lastID,
                jobId,
                content,
                createdAt
            });
        }
    });
}

function getAllSummaries(callback) {
    const sql = `SELECT * FROM summaries`;

    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
}

function getSummaryById(id, callback) {
    const sql = `SELECT * FROM summaries WHERE id = ?`;

    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function updateSummary(id, jobId, content, callback) {
    const sql = `
    UPDATE summaries
    SET jobId = ?, content = ?
    WHERE id = ?
  `;

    db.run(sql, [jobId, content, id], function (err) {
        callback(err, this.changes);
    });
}

function deleteSummary(id, callback) {
    const sql = `DELETE FROM summaries WHERE id = ?`;

    db.run(sql, [id], function (err) {
        callback(err, this.changes);
    });
}

module.exports = {
    createSummary,
    getAllSummaries,
    getSummaryById,
    updateSummary,
    deleteSummary
};