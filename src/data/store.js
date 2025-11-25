// In-memory data store
// For production, replace with a real database (PostgreSQL, MongoDB, etc.)

export const users = new Map();
export const messages = [];
export const onlineUsers = new Map(); // username -> socketId
