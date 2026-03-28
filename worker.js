const amqp = require("amqplib");
const db = require("./database/db");

async function startWorker() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertQueue("transcription.request");

    console.log("Worker started. Waiting for messages...");

    channel.consume("transcription.request", (msg) => {
        const job = JSON.parse(msg.content.toString());

        console.log("Processing job:", job.id);

        // Імітація довгої операції
        setTimeout(() => {
            const sql = `
                UPDATE jobs
                SET status = 'DONE', updatedAt = ?
                WHERE id = ?
            `;

            db.run(sql, [new Date().toISOString(), job.id]);

            console.log("Job completed:", job.id);
        }, 5000);

        channel.ack(msg);
    });
}

startWorker();