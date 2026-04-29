from minio import Minio
from io import BytesIO
import json

MINIO_ENDPOINT = "localhost:9000"
MINIO_ACCESS_KEY = "minioadmin"
MINIO_SECRET_KEY = "minioadmin"
BUCKET_NAME = "summaries"

client = Minio(
    MINIO_ENDPOINT,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False
)

def ensure_bucket():
    if not client.bucket_exists(BUCKET_NAME):
        client.make_bucket(BUCKET_NAME)

def upload_result(job_id, result):
    ensure_bucket()

    s3_key = f"jobs/{job_id}/result.json"
    data = json.dumps(result).encode("utf-8")

    client.put_object(
        BUCKET_NAME,
        s3_key,
        BytesIO(data),
        length=len(data),
        content_type="application/json"
    )

    return s3_key