import { messages, onlineUsers } from "../data/store.js";

export function handleSocketConnection(io, socket) {
  const username = socket.username;
  console.log(`User connected: ${username}`);

  // Add user to online users
  onlineUsers.set(username, socket.id);

  // Send recent messages to the newly connected user
  socket.emit("message_history", messages.slice(-50));

  // Broadcast updated online users list
  io.emit("online_users", Array.from(onlineUsers.keys()));

  // Handle chat messages
  socket.on("send_message", (data) => {
    const message = {
      id: Date.now().toString(),
      username,
      text: data.text,
      timestamp: new Date().toISOString(),
    };

    messages.push(message);

    // Keep only last 100 messages in memory
    if (messages.length > 100) {
      messages.shift();
    }

    // Broadcast message to all clients
    io.emit("new_message", message);
  });

  // Handle WebRTC signaling for video calls
  socket.on("call_user", (data) => {
    const targetSocketId = onlineUsers.get(data.to);
    if (targetSocketId) {
      io.to(targetSocketId).emit("incoming_call", {
        from: username,
        offer: data.offer,
      });
    }
  });

  socket.on("call_answer", (data) => {
    const targetSocketId = onlineUsers.get(data.to);
    if (targetSocketId) {
      io.to(targetSocketId).emit("call_answered", {
        from: username,
        answer: data.answer,
      });
    }
  });

  socket.on("ice_candidate", (data) => {
    const targetSocketId = onlineUsers.get(data.to);
    if (targetSocketId) {
      io.to(targetSocketId).emit("ice_candidate", {
        from: username,
        candidate: data.candidate,
      });
    }
  });

  socket.on("end_call", (data) => {
    const targetSocketId = onlineUsers.get(data.to);
    if (targetSocketId) {
      io.to(targetSocketId).emit("call_ended", {
        from: username,
      });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${username}`);
    onlineUsers.delete(username);
    io.emit("online_users", Array.from(onlineUsers.keys()));
  });
}
