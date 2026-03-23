const jwt = require("jsonwebtoken");
const db = require("../database/db");

const JWT_SECRET = "super_secret_key";

exports.getToken = (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "userId required" });
    }

    db.get("SELECT * FROM users WHERE id = ?", [userId], (err, user) => {
        if (err) return res.status(500).json(err);
        if (!user) return res.status(404).json({ error: "User not found" });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ token });
    });
};