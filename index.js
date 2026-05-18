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

// Load from src/commands (main professional commands)
function loadCommandsFromDir(dir) {
  if (!fs.existsSync(dir)) return;
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
        console.error(`❌ Load error ${fullPath}:`, err.message);
      }
    }
  }
}

// Load simple commands from flat commands/ folder (these can override)
function loadSimpleCommands() {
  const simplePath = path.join(__dirname, 'commands');
  if (!fs.existsSync(simplePath)) return;
  const files = fs.readdirSync(simplePath).filter(f => f.endsWith('.js'));
  for (const file of files) {
    try {
      const command = require(path.join(simplePath, file));
      if (command.data && typeof command.execute === 'function') {
        client.commands.set(command.data.name, command); // Override if exists
        console.log(`✅ Simple override: /${command.data.name}`);
      }
    } catch (err) {
      console.error(`❌ Simple load error ${file}:`, err.message);
    }
  }
}

function loadAllCommands() {
  console.log('📁 Loading from src/commands...');
  loadCommandsFromDir(path.join(__dirname, 'src', 'commands'));
  console.log('📁 Loading simple commands (overrides)...');
  loadSimpleCommands();
  console.log(`📦 Total loaded: ${client.commands.size}`);
}

client.once('clientReady', () => {
  console.log(`🚀 ${client.user.tag} is now online!`);
  loadAllCommands();
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    console.log(`▶️ /${interaction.commandName} by ${interaction.user.tag}`);
    
    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferReply().catch(() => {});
    }
    
    await command.execute(interaction, client);
  } catch (error) {
    console.error(`❌ CRASH in /${interaction.commandName}:`);
    console.error(error.stack || error);  // Full stack trace
    
    const msg = { content: '❌ Something went wrong while running this command.', ephemeral: true };
    try {
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply(msg).catch(() => {});
      } else {
        await interaction.reply(msg).catch(() => {});
      }
    } catch {}
  }
});

const token = process.env.DISCORD_TOKEN;
if (token) client.login(token);