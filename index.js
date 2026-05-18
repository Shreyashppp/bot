const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Collection();

/**
 * Recursively load all slash commands from a directory
 */
function loadCommandsFromDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      loadCommandsFromDir(fullPath);
    } else if (entry.name.endsWith('.js')) {
      try {
        const command = require(fullPath);
        if (command.data && typeof command.execute === 'function') {
          client.commands.set(command.data.name, command);
          console.log(`✅ Loaded: /${command.data.name}`);
        }
      } catch (err) {
        console.error(`❌ Failed to load ${fullPath}:`, err.message);
      }
    }
  }
}

function loadAllCommands() {
  const commandsPath = path.join(__dirname, 'src', 'commands');
  if (fs.existsSync(commandsPath)) {
    console.log('📁 Loading commands from src/commands...');
    loadCommandsFromDir(commandsPath);
  }
  console.log(`📦 Total commands loaded: ${client.commands.size}`);
}

client.once('ready', () => {
  console.log(`🚀 ${client.user.tag} is now online and fresh!`);
  loadAllCommands();
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.warn(`⚠️ Command not found: ${interaction.commandName}`);
    return;
  }

  try {
    console.log(`▶️ Running /${interaction.commandName} by ${interaction.user.tag}`);
    
    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferReply().catch(() => {});
    }
    
    await command.execute(interaction, client);
    
  } catch (error) {
    console.error(`❌ Error in /${interaction.commandName}:`);
    console.error(error); // Full error object
    
    const errorMsg = '❌ Something went wrong while running this command.';
    
    try {
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ content: errorMsg, ephemeral: true }).catch(() => {});
      } else {
        await interaction.reply({ content: errorMsg, ephemeral: true }).catch(() => {});
      }
    } catch (e) {
      console.error('Failed to send error message:', e.message);
    }
  }
});

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error('❌ DISCORD_TOKEN is missing!');
} else {
  client.login(token);
}