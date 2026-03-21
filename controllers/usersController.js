const usersModel = require("../models/usersModel");

function createUser(req, res) {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            error: "Name and email are required"
        });
    }

    usersModel.createUser(name, email, (err, user) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.status(201).json(user);
    });
}

function getAllUsers(req, res) {
    usersModel.getAllUsers((err, users) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(users);
    });
}

function getUserById(req, res) {
    const { id } = req.params;

    usersModel.getUserById(id, (err, user) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        res.json(user);
    });
}

function updateUser(req, res) {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            error: "Name and email are required"
        });
    }

    usersModel.updateUser(id, name, email, (err, changes) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (changes === 0) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        res.json({
            message: "User updated successfully"
        });
    });
}

function deleteUser(req, res) {
    const { id } = req.params;

    usersModel.deleteUser(id, (err, changes) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (changes === 0) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        res.json({
            message: "User deleted successfully"
        });
    });
}

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};