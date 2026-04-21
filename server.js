const app = require("./app");
const rabbitmqService = require("./services/rabbitmqService");
const jobEventsConsumer = require("./services/jobEventsConsumer");

async function startServer() {
    try {
        await rabbitmqService.connectRabbitMQ();
        await jobEventsConsumer.startJobEventsConsumer();

        app.listen(3000, () => {
            console.log("Server started on http://localhost:3000");
        });
    } catch (err) {
        console.error("Failed to start server:", err.message);
    }
}

startServer();