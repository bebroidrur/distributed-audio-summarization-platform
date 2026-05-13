import { getToken } from "./api";

let socket = null;

export function connectWebSocket(onMessage, onStatusChange) {
    const token = getToken();

    if (!token) {
        onStatusChange("No token");
        return null;
    }

    socket = new WebSocket(`ws://localhost:3000?token=${token}`);

    socket.onopen = () => {
        onStatusChange("Connected");
        console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onMessage(data);
    };

    socket.onclose = () => {
        onStatusChange("Disconnected");
        console.log("WebSocket disconnected");
    };

    socket.onerror = () => {
        onStatusChange("Error");
        console.log("WebSocket error");
    };

    return socket;
}

export function closeWebSocket() {
    if (socket) {
        socket.close();
        socket = null;
    }
}