const Minio = require("minio");

const BUCKET_NAME = "summaries";

const minioClient = new Minio.Client({
    endPoint: "localhost",
    port: 9000,
    useSSL: false,
    accessKey: "minioadmin",
    secretKey: "minioadmin"
});

function getObject(s3Key) {
    return new Promise((resolve, reject) => {
        let data = "";

        minioClient.getObject(BUCKET_NAME, s3Key, (err, stream) => {
            if (err) {
                return reject(err);
            }

            stream.on("data", (chunk) => {
                data += chunk.toString();
            });

            stream.on("end", () => {
                resolve(data);
            });

            stream.on("error", reject);
        });
    });
}

module.exports = {
    getObject
};