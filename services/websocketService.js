const WebSocket = require("ws");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "super_secret_key";

let wss;
const clients = new Map();

function initWebSocketServer(server) {
    wss = new WebSocket.Server({ server });

    wss.on("connection", (ws, req) => {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const token = url.searchParams.get("token");

        if (!token) {
            ws.close(1008, "No token provided");
            return;
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const userId = decoded.userId;

            ws.userId = userId;
            addClient(userId, ws);

            console.log(`WebSocket client connected. userId=${userId}`);

            ws.send(JSON.stringify({
                type: "connected",
                message: "WebSocket connection established"
            }));

            ws.on("close", () => {
                removeClient(userId, ws);
                console.log(`WebSocket client disconnected. userId=${userId}`);
            });

        } catch (err) {
            ws.close(1008, "Invalid token");
        }
    });

    console.log("WebSocket server initialized");
}

function addClient(userId, ws) {
    const userClients = clients.get(userId) || [];
    userClients.push(ws);
    clients.set(userId, userClients);
}

function removeClient(userId, ws) {
    const userClients = clients.get(userId) || [];
    clients.set(
        userId,
        userClients.filter((client) => client !== ws)
    );
}

function sendToUser(userId, event) {
    const userClients = clients.get(userId) || [];

    userClients.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(event));
        }
    });
}

module.exports = {
    initWebSocketServer,
    sendToUser
};