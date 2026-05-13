import { useEffect, useState } from "react";
import { createJob, getAuthToken, getJobs, setToken } from "./api";
import "./App.css";

function App() {
  const [userId, setUserId] = useState("1");
  const [audioId, setAudioId] = useState("1");
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState("");

  async function login() {
    const data = await getAuthToken(Number(userId));

    if (data.token) {
      setToken(data.token);
      setMessage("Token saved");
      loadJobs();
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
      loadJobs();
    } else {
      setMessage(data.error || "Failed to create job");
    }
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      loadJobs();
    }
  }, []);

  return (
      <div className="page">
        <h1>Distributed Audio Summarization Platform</h1>
        <p>Frontend Lab 7 – React as a Client</p>

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
          <button onClick={loadJobs}>Refresh Jobs</button>

          {jobs.length === 0 ? (
              <p>No jobs yet</p>
          ) : (
              <table>
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Audio ID</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
                </thead>
                <tbody>
                {jobs.map((job) => (
                    <tr key={job.id}>
                      <td>{job.id}</td>
                      <td>{job.audioId}</td>
                      <td>{job.status}</td>
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