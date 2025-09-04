const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Discord Bot...');

// --- Configuration ---
let config = {};

function loadConfig() {
  try {
    const configPath = path.join(__dirname, 'config.json');
    const rawConfig = fs.readFileSync(configPath, 'utf-8');
    config = JSON.parse(rawConfig);
    console.log('✅ Configuration loaded successfully.');
  } catch (error) {
    console.error('❌ Failed to load config.json:', error.message);
    console.error('Please ensure config.json exists and is correctly formatted.');
    // Exit if config is essential for startup
    process.exit(1); 
  }
}

// --- Discord Bot Client ---
let discordClient = null;
let discordBotReady = false;

// --- Express Server ---
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- Core Bot Functions ---

/**
 * Initializes the Discord bot client.
 * It will destroy any existing client and create a new one with the current configuration.
 */
async function initializeDiscordBot() {
  if (!config.botToken || config.botToken === 'YOUR_DISCORD_BOT_TOKEN_HERE') {
    console.log('⚠️ Bot token not found in config.json. Skipping bot initialization.');
    discordBotReady = false;
    return;
  }

  try {
    if (discordClient) {
      await discordClient.destroy();
      console.log('👻 Previous bot instance destroyed.');
    }

    discordClient = new Client({
      intents: [GatewayIntentBits.Guilds]
    });

    discordClient.once('ready', () => {
      console.log(`🤖 Discord bot logged in as ${discordClient.user.tag}!`);
      discordBotReady = true;
      // Send the message as soon as the bot is ready
      sendConfiguredMessage();
    });

    discordClient.on('error', (error) => {
      console.error('❌ Discord bot error:', error);
      discordBotReady = false;
    });

    await discordClient.login(config.botToken);
  } catch (error) {
    console.error('❌ Failed to initialize Discord bot:', error.message);
    discordBotReady = false;
  }
}

/**
 * Sends a pre-defined message from config.json to the configured channel.
 */
async function sendConfiguredMessage() {
  if (!discordBotReady || !discordClient) {
    return { success: false, error: 'Discord bot is not ready.' };
  }

  if (!config.channelId || config.channelId === 'YOUR_DISCORD_CHANNEL_ID_HERE') {
    return { success: false, error: 'Discord channelId not set in config.json.' };
  }

  if (!config.message || !config.message.button || !config.message.button.url) {
    return { success: false, error: 'Message configuration is incomplete in config.json.' };
  }

  try {
    const channel = await discordClient.channels.fetch(config.channelId);
    if (!channel) {
      return { success: false, error: `Channel with ID ${config.channelId} not found.` };
    }

    // Build the embed message
    const embed = new EmbedBuilder()
      .setColor(0x5865F2) // Discord blue
      .setTitle(config.message.title || 'Verification')
      .setDescription(config.message.description || 'Click the button below to proceed.');

    // Build the action row with a single link button
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel(config.message.button.text || 'Click Here')
          .setStyle(ButtonStyle.Link)
          .setURL(config.message.button.url)
          .setEmoji('🚀')
      );

    await channel.send({
      embeds: [embed],
      components: [row]
    });

    console.log(`✅ Message sent successfully to channel ${config.channelId}.`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send Discord message:', error.message);
    return { success: false, error: error.message };
  }
}

// --- API Endpoints ---

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    botReady: discordBotReady,
    timestamp: new Date().toISOString()
  });
});

/**
 * Updates the configuration and re-initializes the bot.
 * Expects: { "botToken": "...", "channelId": "..." }
 */
app.post('/configure', async (req, res) => {
  const { botToken, channelId } = req.body;

  if (!botToken || !channelId) {
    return res.status(400).json({ success: false, message: 'botToken and channelId are required.' });
  }

  // Update in-memory config
  config.botToken = botToken;
  config.channelId = channelId;
  
  // Note: This does not save to config.json to avoid file write complexities in all environments
  console.log('🔧 Bot configuration updated in memory. Re-initializing...');
  
  await initializeDiscordBot();
  
  res.json({ 
    success: true, 
    message: 'Configuration updated. The bot is re-initializing.',
    botReady: discordBotReady
  });
});


/**
 * Triggers the bot to send the message defined in config.json.
 */
app.post('/send-message', async (req, res) => {
  const result = await sendConfiguredMessage();
  if (result.success) {
    res.json({ success: true, message: 'Message sent successfully.' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to send message.', error: result.error });
  }
});


// --- Server Startup ---

function startServer() {
  app.listen(PORT, async () => {
    console.log(`✅ API server running on http://localhost:${PORT}`);
    // Initial bot startup
    await initializeDiscordBot();
  });
}

// Load config and then start the server
loadConfig();
startServer();
