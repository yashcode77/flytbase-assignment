# Backend Setup

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/flytbase

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Session Secret
SESSION_SECRET=your-session-secret-key-change-this-in-production

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Backend URL (for OAuth callback)
BACKEND_URL=http://localhost:5050

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Server Configuration
PORT=5050
NODE_ENV=development
```

## Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Set the authorized redirect URI to: `http://localhost:5050/api/auth/google/callback`
6. Copy the Client ID and Client Secret to your `.env` file

## Running the Server

```bash
npm install
npm start
```

The server will run on `http://localhost:5050` 