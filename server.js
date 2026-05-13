const http = require("http");
const app = require("./app");
const rabbitmqService = require("./services/rabbitmqService");
const jobEventsConsumer = require("./services/jobEventsConsumer");
const websocketService = require("./services/websocketService");

async function startServer() {
    try {
        await rabbitmqService.connectRabbitMQ();

        const server = http.createServer(app);

        websocketService.initWebSocketServer(server);

        await jobEventsConsumer.startJobEventsConsumer();

        server.listen(3000, () => {
            console.log("Server started on http://localhost:3000");
        });
    } catch (err) {
        console.error("Failed to start server:", err.message);
    }
}

startServer();