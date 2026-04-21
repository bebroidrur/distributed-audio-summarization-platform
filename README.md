# Distributed Audio Summarization Platform

## Backend Laboratory Works

This repository contains the backend implementation for the Distributed Audio Summarization Platform developed across multiple laboratory works.

The system manages users, audio files, processing jobs, and summaries.  
The backend evolves from basic CRUD operations to authentication and asynchronous processing using a message broker.

Technologies used:
- Node.js
- Express
- SQLite
- JWT Authentication
- RabbitMQ
- Async Worker

---

# Laboratory Work 1 – CRUD + SQLite

## Description
In Laboratory Work 1, the basic backend system was implemented with CRUD operations and SQLite database.

The system includes the following entities:
- Users
- Audios
- Jobs
- Summaries

For each entity, CRUD operations were implemented:
- Create
- Read
- Update
- Delete

## Database Entities

### Users
Represents system users.
Fields:
- id
- name
- email

### Audios
Represents uploaded audio files.
Fields:
- id
- userId
- title
- filePath
- duration

### Jobs
Represents audio processing tasks.
Fields:
- id
- audioId
- status
- createdAt
- updatedAt

### Summaries
Represents generated summaries.
Fields:
- id
- jobId
- summaryText

## REST API Endpoints
/users
/audios
/jobs
/summaries


Each endpoint supports:
- POST (Create)
- GET (Read)
- PUT (Update)
- DELETE (Delete)

SQLite database is used for data storage.

---
# Laboratory Work 2 – Authentication & Authorization

## Description
In Laboratory Work 2, authentication and authorization were implemented using JWT tokens.

Main features:
- Token generation
- Authentication middleware
- Protected routes
- User authorization
- Linking users to audios and jobs

## Authentication Flow
1. User is created
2. Token is generated via `/auth/token`
3. Client sends token in Authorization header:

Authorization: Bearer <token>

4. Middleware verifies token
5. User can only access their own resources

## Protected Endpoints
Protected routes:

/audios
/jobs
/summaries


This ensures that users can only access and modify their own data.

---
# Laboratory Work 3 – Message Broker & Async Processing

## Description
In Laboratory Work 3, asynchronous job processing was implemented using RabbitMQ.

The system now supports background processing for long-running tasks such as transcription or summarization.

## System Components
The system consists of:
- Backend API (Express)
- RabbitMQ message broker
- Worker service
- SQLite database

## Async Job Processing Flow
1. Client sends POST `/jobs`
2. Backend creates a job with status `QUEUED`
3. Backend publishes a message to RabbitMQ queue
4. Worker receives the message
5. Worker processes the job (simulated processing)
6. Worker updates job status to `DONE`
7. Backend does not block and responds immediately

## Result
- Jobs move to `QUEUED`
- Worker processes jobs asynchronously
- Job status changes to `DONE`
- Backend remains responsive

This demonstrates asynchronous processing using a message broker and worker architecture.

---
# Laboratory Work 4 – Background & Async Processing (Non-HTTP Services)

## Description
In Laboratory Work 4, heavy background processing was moved to a separate Python service.

Main features implemented:
- Python background worker
- Communication only through RabbitMQ
- No HTTP API in background service
- Event-driven workflow between backend and worker
- Job lifecycle updates through events
- Simulated heavy processing in Python
- Backend remains stable and non-blocking

## Architecture
Node.js Backend → RabbitMQ → Python Background Worker → RabbitMQ Events → Node.js Backend

## Event Types
- progress
- completed
- failed

## Job Lifecycle
- CREATED
- PROCESSING
- DONE
- ERROR

---
# Project Structure

controllers/
models/
routes/
services/
database/
middleware/
worker.js
app.js


---

# How to Run the Project

## Install dependencies

npm install


## Run backend server

node app.js


## Run worker

node worker.js


## RabbitMQ must be running locally
Default:

amqp://localhost


---

# Author
Backend Laboratory Works – Distributed Systems