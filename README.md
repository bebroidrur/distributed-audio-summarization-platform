# Distributed Audio Summarization Platform
## Backend – Lab 1 (CRUD + SQLite)

### Description
This laboratory work implements the basic backend for the Distributed Audio Summarization Platform.

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

The backend is built using:
- Node.js
- Express
- SQLite

## Database Entities
The system includes the following entities:

### 1. Users
Represents system users.
- id
- name
- email

### 2. Audios
Represents uploaded audio files.
- id
- user_id
- title
- file_path
- status

### 3. Jobs
Represents audio processing tasks.
- id
- audio_id
- status
- created_at

### 4. Summaries
Represents generated text summaries.
- id
- job_id
- summary_text

## CRUD Operations
For each entity, the following operations were implemented:
- Create
- Read
- Update
- Delete

REST API endpoints:
/users
/audios
/jobs
/summaries
