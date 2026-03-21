const db = require("../database/db");

function createUser(name, email, callback) {
    const createdAt = new Date().toISOString();

    const sql = `
    INSERT INTO users (name, email, createdAt)
    VALUES (?, ?, ?)
  `;

    db.run(sql, [name, email, createdAt], function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null, {
                id: this.lastID,
                name,
                email,
                createdAt
            });
        }
    });
}

function getAllUsers(callback) {
    const sql = `SELECT * FROM users`;

    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
}

function getUserById(id, callback) {
    const sql = `SELECT * FROM users WHERE id = ?`;

    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
}

function updateUser(id, name, email, callback) {
    const sql = `
    UPDATE users
    SET name = ?, email = ?
    WHERE id = ?
  `;

    db.run(sql, [name, email, id], function (err) {
        callback(err, this.changes);
    });
}

function deleteUser(id, callback) {
    const sql = `DELETE FROM users WHERE id = ?`;

    db.run(sql, [id], function (err) {
        callback(err, this.changes);
    });
}

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};