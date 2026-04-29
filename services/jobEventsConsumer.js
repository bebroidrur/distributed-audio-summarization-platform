const amqp = require("amqplib");
const jobsModel = require("../models/jobsModel");

const RABBITMQ_URL = "amqp://localhost";
const EVENTS_QUEUE = "job.events";

async function startJobEventsConsumer() {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(EVENTS_QUEUE, { durable: true });

    console.log("Backend is listening for job events...");

    channel.consume(EVENTS_QUEUE, (msg) => {
        if (!msg) return;

        try {
            const event = JSON.parse(msg.content.toString());

            console.log("Event received:", event);

            const {
                jobId,
                event: eventType,
                s3Key
            } = event;

            if (!jobId) {
                console.log("Event without jobId, skipping");
                channel.ack(msg);
                return;
            }

            if (eventType === "progress") {
                jobsModel.updateJobStatus(jobId, "PROCESSING", null, (err) => {
                    if (err) {
                        console.error("Failed to update job to PROCESSING:", err.message);
                    } else {
                        console.log(`Job ${jobId} updated to PROCESSING`);
                    }

                    channel.ack(msg);
                });

            } else if (eventType === "completed") {
                jobsModel.updateJobStatus(jobId, "DONE", s3Key, (err) => {
                    if (err) {
                        console.error("Failed to update job to DONE:", err.message);
                    } else {
                        console.log(`Job ${jobId} updated to DONE with s3Key: ${s3Key}`);
                    }

                    channel.ack(msg);
                });

            } else if (eventType === "failed") {
                jobsModel.updateJobStatus(jobId, "ERROR", null, (err) => {
                    if (err) {
                        console.error("Failed to update job to ERROR:", err.message);
                    } else {
                        console.log(`Job ${jobId} updated to ERROR`);
                    }

                    channel.ack(msg);
                });

            } else {
                console.log("Unknown event type:", eventType);
                channel.ack(msg);
            }

        } catch (err) {
            console.error("Failed to process event:", err.message);
            channel.ack(msg);
        }
    });
}

module.exports = {
    startJobEventsConsumer
};