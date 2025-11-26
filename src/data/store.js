import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "users.json");

// Load users from file if it exists
function loadUsers() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf8");
      const usersArray = JSON.parse(data);
      return new Map(usersArray);
    }
  } catch (error) {
    console.error("Error loading users:", error);
  }
  return new Map();
}

// Save users to file
function saveUsers() {
  try {
    const usersArray = Array.from(users.entries());
    fs.writeFileSync(DATA_FILE, JSON.stringify(usersArray, null, 2));
  } catch (error) {
    console.error("Error saving users:", error);
  }
}

// In-memory data store
// For production, replace with a real database (PostgreSQL, MongoDB, etc.)

export const users = loadUsers();
export const messages = [];
export const onlineUsers = new Map(); // username -> socketId

// Export save function for use in auth routes
export { saveUsers };
