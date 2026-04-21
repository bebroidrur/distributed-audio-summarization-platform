import pika
import json
import time

RABBITMQ_URL = "amqp://localhost"
QUEUE_NAME = "transcription.request"

def connect():
    connection = pika.BlockingConnection(
        pika.URLParameters(RABBITMQ_URL)
    )
    channel = connection.channel()

    channel.queue_declare(queue=QUEUE_NAME, durable=True)

    print("🐍 Worker connected to RabbitMQ")

    return connection, channel


def process_job(ch, method, properties, body):
    job = json.loads(body)

    print(f"📥 Received job: {job}")

    # 🔥 Stub (імітація довгої операції)
    print("⏳ Processing...")
    time.sleep(5)

    print(f"✅ Job processed: {job['id']}")

    ch.basic_ack(delivery_tag=method.delivery_tag)


def start_worker():
    connection, channel = connect()

    channel.basic_consume(
        queue=QUEUE_NAME,
        on_message_callback=process_job
    )

    print("🚀 Worker started. Waiting for jobs...")

    channel.start_consuming()


if __name__ == "__main__":
    start_worker()