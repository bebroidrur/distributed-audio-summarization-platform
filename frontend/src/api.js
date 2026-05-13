const API_URL = "http://localhost:3000";

export function getToken() {
    return localStorage.getItem("token");
}

export function setToken(token) {
    localStorage.setItem("token", token);
}

export async function getAuthToken(userId) {
    const response = await fetch(`${API_URL}/auth/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId })
    });

    return response.json();
}

export async function getJobs() {
    const response = await fetch(`${API_URL}/jobs`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    return response.json();
}

export async function createJob(audioId) {
    const response = await fetch(`${API_URL}/jobs`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ audioId })
    });

    return response.json();
}