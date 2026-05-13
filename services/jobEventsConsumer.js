const amqp = require("amqplib");
const jobsModel = require("../models/jobsModel");
const websocketService = require("./websocketService");

const RABBITMQ_URL = "amqp://localhost";
const EVENTS_QUEUE = "job.events";

async function startJobEventsConsumer() {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(EVENTS_QUEUE, {
        durable: true
    });

    console.log("Backend is listening for job events...");

    channel.consume(EVENTS_QUEUE, (msg) => {
        if (!msg) return;

        const event = JSON.parse(msg.content.toString());

        console.log("Event received:", event);

        const { jobId, event: eventType, status } = event;

        if (eventType === "progress") {

            jobsModel.updateJobStatus(jobId, "PROCESSING", (err) => {

                if (err) {
                    console.error(
                        "Failed to update job to PROCESSING:",
                        err.message
                    );
                } else {

                    console.log(`Job ${jobId} updated to PROCESSING`);

                    notifyUserAboutJobEvent(jobId, event);
                }

                channel.ack(msg);
            });

        } else if (eventType === "completed") {

            jobsModel.updateJobStatus(jobId, "DONE", (err) => {

                if (err) {
                    console.error(
                        "Failed to update job to DONE:",
                        err.message
                    );
                } else {

                    console.log(`Job ${jobId} updated to DONE`);

                    notifyUserAboutJobEvent(jobId, event);
                }

                channel.ack(msg);
            });

        } else if (eventType === "failed") {

            jobsModel.updateJobStatus(jobId, "ERROR", (err) => {

                if (err) {
                    console.error(
                        "Failed to update job to ERROR:",
                        err.message
                    );
                } else {

                    console.log(`Job ${jobId} updated to ERROR`);

                    notifyUserAboutJobEvent(jobId, event);
                }

                channel.ack(msg);
            });
        }
    });
}

function notifyUserAboutJobEvent(jobId, event) {

    jobsModel.getJobById(jobId, (err, job) => {

        if (err || !job) {

            console.error(
                "Failed to find job for WebSocket notification"
            );

            return;
        }

        websocketService.sendToUser(job.userId, {

            type: "job_event",

            jobId,

            status: event.status,

            event: event.event,

            progress: event.progress || null,

            result: event.result || null
        });
    });
}

module.exports = {
    startJobEventsConsumer
};