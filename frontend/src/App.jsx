import { useEffect, useState } from "react";
import { createJob, getAuthToken, getJobs, setToken } from "./api";
import { closeWebSocket, connectWebSocket } from "./websocket";
import "./App.css";

function App() {
  const [userId, setUserId] = useState("1");
  const [audioId, setAudioId] = useState("1");
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState("");
  const [wsStatus, setWsStatus] = useState("Disconnected");

  async function login() {
    const data = await getAuthToken(Number(userId));

    if (data.token) {
      setToken(data.token);
      setMessage("Token saved");

      await loadJobs();

      connectWebSocket(handleWebSocketMessage, setWsStatus);
    } else {
      setMessage(data.error || "Failed to get token");
    }
  }

  async function loadJobs() {
    const data = await getJobs();

    if (Array.isArray(data)) {
      setJobs(data);
    } else {
      setMessage(data.error || "Failed to load jobs");
    }
  }

  async function handleCreateJob() {
    const data = await createJob(Number(audioId));

    if (data.id) {
      setMessage("Job created");
      await loadJobs();
    } else {
      setMessage(data.error || "Failed to create job");
    }
  }

  function handleWebSocketMessage(data) {
    if (data.type === "connected") {
      setMessage("WebSocket connected");
      return;
    }

    if (data.type === "job_event") {
      setJobs((prevJobs) =>
          prevJobs.map((job) =>
              job.id === data.jobId
                  ? {
                    ...job,
                    status: data.status,
                    progress: data.progress
                  }
                  : job
          )
      );

      setMessage(`Job ${data.jobId}: ${data.status}`);
    }
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      loadJobs();
      connectWebSocket(handleWebSocketMessage, setWsStatus);
    }

    return () => {
      closeWebSocket();
    };
  }, []);

  return (
      <div className="page">
        <h1>Distributed Audio Summarization Platform</h1>
        <p>Frontend Lab 8 – Real-Time Frontend (WebSocket)</p>

        <section className="card">
          <h2>Authentication</h2>
          <input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="User ID"
          />
          <button onClick={login}>Get JWT Token</button>
        </section>

        <section className="card">
          <h2>WebSocket</h2>
          <p>Status: {wsStatus}</p>
        </section>

        <section className="card">
          <h2>Create Job</h2>
          <input
              value={audioId}
              onChange={(e) => setAudioId(e.target.value)}
              placeholder="Audio ID"
          />
          <button onClick={handleCreateJob}>Create Job</button>
        </section>

        <section className="card">
          <h2>Jobs</h2>
          <button onClick={loadJobs}>Refresh Jobs (REST fallback)</button>

          {jobs.length === 0 ? (
              <p>No jobs yet</p>
          ) : (
              <table>
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Audio ID</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Created</th>
                </tr>
                </thead>
                <tbody>
                {jobs.map((job) => (
                    <tr key={job.id}>
                      <td>{job.id}</td>
                      <td>{job.audioId}</td>
                      <td>{job.status}</td>
                      <td>
                        {job.progress
                            ? `${job.progress}%`
                            : "-"}
                      </td>
                      <td>{job.createdAt}</td>
                    </tr>
                ))}
                </tbody>
              </table>
          )}
        </section>

        {message && <p className="message">{message}</p>}
      </div>
  );
}

export default App;