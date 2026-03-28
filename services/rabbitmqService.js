const amqp = require("amqplib");

let channel;

async function connectRabbitMQ() {
    const connection = await amqp.connect("amqp://localhost");
    channel = await connection.createChannel();

    await channel.assertQueue("transcription.request");

    console.log("Connected to RabbitMQ");
}

function publishTranscriptionRequest(job) {
    const message = JSON.stringify(job);
    channel.sendToQueue("transcription.request", Buffer.from(message));
}

module.exports = {
    connectRabbitMQ,
    publishTranscriptionRequest
};