const WebSocket = require("ws");

let wss;
const clients = new Map();

function initWebSocketServer(server) {
    wss = new WebSocket.Server({ server });

    wss.on("connection", (ws) => {
        console.log("WebSocket client connected");

        ws.on("close", () => {
            for (const [userId, sockets] of clients.entries()) {
                clients.set(
                    userId,
                    sockets.filter((client) => client !== ws)
                );
            }

            console.log("WebSocket client disconnected");
        });
    });

    console.log("WebSocket server initialized");
}

function addClient(userId, ws) {
    const userClients = clients.get(userId) || [];
    userClients.push(ws);
    clients.set(userId, userClients);
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
    addClient,
    sendToUser
};