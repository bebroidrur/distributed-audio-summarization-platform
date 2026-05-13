import { getToken } from "./api";

let socket = null;
let reconnectTimer = null;

export function connectWebSocket(onMessage, onStatusChange) {
    const token = getToken();

    if (!token) {
        onStatusChange("No token");
        return null;
    }

    if (socket && socket.readyState === WebSocket.OPEN) {
        return socket;
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
        onStatusChange("Disconnected. Reconnecting...");

        reconnectTimer = setTimeout(() => {
            connectWebSocket(onMessage, onStatusChange);
        }, 3000);
    };

    socket.onerror = () => {
        onStatusChange("WebSocket error");
        console.log("WebSocket error");
    };

    return socket;
}

export function closeWebSocket() {
    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }

    if (socket) {
        socket.close();
        socket = null;
    }
}