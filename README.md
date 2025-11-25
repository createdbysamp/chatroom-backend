# Chatroom Backend Server

Backend server for the chatroom application with WebSocket support for real-time messaging and WebRTC signaling for video calls.

## Features

- User authentication (register/login) with JWT
- Real-time messaging via Socket.io
- WebRTC signaling for peer-to-peer video calls
- Online user presence tracking
- In-memory data storage (easily replaceable with a database)

## Tech Stack

- Node.js with Express
- Socket.io for WebSocket connections
- JWT for authentication
- bcryptjs for password hashing

## Getting Started

### Installation

```bash
npm install
```

### Configuration

1. Copy the environment example file:

   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your configuration:
   - `PORT`: Server port (default: 3000)
   - `FRONTEND_URL`: Your frontend URL for CORS
   - `JWT_SECRET`: Secret key for JWT tokens (change in production!)

### Development

```bash
npm run dev
```

The server will run on `http://localhost:3000` with auto-reload on file changes.

### Production

```bash
npm start
```

## API Endpoints

### Authentication

**POST /api/auth/register**

- Body: `{ "username": "string", "password": "string" }`
- Response: `{ "token": "string", "username": "string" }`

**POST /api/auth/login**

- Body: `{ "username": "string", "password": "string" }`
- Response: `{ "token": "string", "username": "string" }`

**GET /health**

- Response: `{ "status": "ok", "timestamp": "ISO string" }`

## Socket.io Events

### Client → Server

- `send_message`: Send a chat message

  - Data: `{ "text": "string" }`

- `call_user`: Initiate a video call

  - Data: `{ "to": "username", "offer": RTCSessionDescription }`

- `call_answer`: Answer a video call

  - Data: `{ "to": "username", "answer": RTCSessionDescription }`

- `ice_candidate`: Send ICE candidate

  - Data: `{ "to": "username", "candidate": RTCIceCandidate }`

- `end_call`: End a video call
  - Data: `{ "to": "username" }`

### Server → Client

- `message_history`: Recent messages (sent on connection)

  - Data: Array of message objects

- `new_message`: New chat message

  - Data: `{ "id": "string", "username": "string", "text": "string", "timestamp": "ISO string" }`

- `online_users`: List of online users

  - Data: Array of usernames

- `incoming_call`: Incoming video call

  - Data: `{ "from": "username", "offer": RTCSessionDescription }`

- `call_answered`: Call was answered

  - Data: `{ "from": "username", "answer": RTCSessionDescription }`

- `ice_candidate`: ICE candidate from peer

  - Data: `{ "from": "username", "candidate": RTCIceCandidate }`

- `call_ended`: Call was ended
  - Data: `{ "from": "username" }`

## Deploying to Railway

### Prerequisites

1. Create a [Railway](https://railway.app) account
2. Install Railway CLI (optional): `npm install -g @railway/cli`

### Deployment Steps

#### Option 1: Deploy from GitHub (Recommended)

1. Push this backend code to a GitHub repository:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/chatroom-backend.git
   git push -u origin main
   ```

2. Go to [Railway Dashboard](https://railway.app/dashboard)

3. Click "New Project" → "Deploy from GitHub repo"

4. Select your backend repository

5. Railway will auto-detect Node.js and deploy

6. Add environment variables in Railway dashboard:

   - `FRONTEND_URL`: Your frontend URL (e.g., `https://your-app.vercel.app`)
   - `JWT_SECRET`: A secure random string (generate with `openssl rand -base64 32`)
   - `PORT`: Railway sets this automatically, but you can override if needed

7. Your backend will be deployed and you'll get a URL like:
   `https://your-app.up.railway.app`

#### Option 2: Deploy with Railway CLI

1. Login to Railway:

   ```bash
   railway login
   ```

2. Initialize project:

   ```bash
   railway init
   ```

3. Add environment variables:

   ```bash
   railway variables set FRONTEND_URL=https://your-frontend-url.com
   railway variables set JWT_SECRET=your-secure-secret-key
   ```

4. Deploy:
   ```bash
   railway up
   ```

### Post-Deployment

1. Copy your Railway backend URL (e.g., `https://your-app.up.railway.app`)

2. Update your frontend environment variables:

   - `VITE_WEBSOCKET_URL`: `wss://your-app.up.railway.app`
   - `VITE_API_URL`: `https://your-app.up.railway.app`

3. Redeploy your frontend with the updated environment variables

## Production Considerations

### Database

This server uses in-memory storage, which means:

- Data is lost when the server restarts
- Not suitable for production with multiple instances

For production, replace the in-memory store with a database:

- **PostgreSQL**: For structured data (users, messages)
- **MongoDB**: For flexible document storage
- **Redis**: For session management and caching

### Security

- Change `JWT_SECRET` to a strong random value
- Use HTTPS in production (Railway provides this automatically)
- Implement rate limiting for API endpoints
- Add input validation and sanitization
- Consider adding refresh tokens for better security

### Scalability

- Add Redis for Socket.io adapter to support multiple server instances
- Implement message pagination
- Add database indexes for performance
- Consider using a message queue for high traffic

## Troubleshooting

### CORS Issues

If you get CORS errors, ensure `FRONTEND_URL` in your `.env` matches your frontend URL exactly.

### WebSocket Connection Failed

- Verify the backend is running and accessible
- Check that the frontend is using the correct WebSocket URL
- Ensure Railway deployment is successful (check logs)

### Authentication Errors

- Verify JWT_SECRET is set correctly
- Check that tokens are being sent in Socket.io handshake auth
- Ensure token hasn't expired (7-day expiry by default)

## License

MIT
