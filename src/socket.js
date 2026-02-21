// src/socket.js
import { io } from "socket.io-client";

const socket = io("https://jewellery-backend-icja.onrender.com", {
    transports: ["websocket", "polling"],
});

socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id); // ⚡ ADD
});

socket.on("connect_error", (err) => {
    console.log("❌ Socket error:", err.message); // ⚡ ADD
});

export default socket;