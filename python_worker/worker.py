import pika
import json
import time
import math

RABBITMQ_URL = "amqp://localhost"
REQUEST_QUEUE = "transcription.request"
EVENTS_QUEUE = "job.events"


def connect():
    connection = pika.BlockingConnection(
        pika.URLParameters(RABBITMQ_URL)
    )
    channel = connection.channel()

    channel.queue_declare(queue=REQUEST_QUEUE, durable=True)
    channel.queue_declare(queue=EVENTS_QUEUE, durable=True)

    print("Worker connected to RabbitMQ")

    return connection, channel


def publish_event(channel, event_data):
    message = json.dumps(event_data)
    channel.basic_publish(
        exchange="",
        routing_key=EVENTS_QUEUE,
        body=message,
        properties=pika.BasicProperties(
            delivery_mode=2
        )
    )
    print(f"Published event: {event_data}")


def heavy_processing_simulation(job_id):
    total = 0

    # етап 1
    for i in range(1, 200000):
        total += math.sqrt(i)

    # етап 2
    for i in range(1, 150000):
        total += math.log(i + 1)

    # етап 3
    for i in range(1, 100000):
        total += math.sin(i)

    return round(total, 2)


def process_job(ch, method, properties, body):
    try:
        job = json.loads(body)
        job_id = job["id"]

        print(f"Received job: {job}")

        publish_event(ch, {
            "jobId": job_id,
            "event": "progress",
            "status": "PROCESSING",
            "progress": 10
        })

        time.sleep(1)

        publish_event(ch, {
            "jobId": job_id,
            "event": "progress",
            "status": "PROCESSING",
            "progress": 30
        })

        result = heavy_processing_simulation(job_id)

        publish_event(ch, {
            "jobId": job_id,
            "event": "progress",
            "status": "PROCESSING",
            "progress": 80
        })

        time.sleep(1)

        publish_event(ch, {
            "jobId": job_id,
            "event": "completed",
            "status": "DONE",
            "result": {
                "summary": f"Heavy processing completed for job {job_id}",
                "value": result
            }
        })

        print(f"Job completed: {job_id}, result={result}")

        ch.basic_ack(delivery_tag=method.delivery_tag)

    except Exception as err:
        print(f"Job failed: {err}")

        try:
            failed_job = json.loads(body)
            job_id = failed_job.get("id")
        except Exception:
            job_id = None

        publish_event(ch, {
            "jobId": job_id,
            "event": "failed",
            "status": "ERROR",
            "error": str(err)
        })

        ch.basic_ack(delivery_tag=method.delivery_tag)


def start_worker():
    connection, channel = connect()

    channel.basic_consume(
        queue=REQUEST_QUEUE,
        on_message_callback=process_job
    )

    print("Worker started. Waiting for jobs...")

    channel.start_consuming()


if __name__ == "__main__":
    start_worker()