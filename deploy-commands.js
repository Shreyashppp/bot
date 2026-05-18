const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const commands = [];

function loadCommandsFromDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      loadCommandsFromDir(fullPath);
    } else if (entry.name.endsWith('.js')) {
      try {
        const command = require(fullPath);
        if (command.data) {
          commands.push(command.data.toJSON());
          console.log(`📤 Queued for deploy: /${command.data.name}`);
        }
      } catch (err) {
        console.error(`❌ Failed to load for deploy ${fullPath}:`, err.message);
      }
    }
  }
}

console.log('📁 Loading commands for deployment from src/commands...');
const commandsPath = path.join(__dirname, 'src', 'commands');
if (fs.existsSync(commandsPath)) {
  loadCommandsFromDir(commandsPath);
}

console.log(`📦 Total commands to register: ${commands.length}`);

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('🚀 Started refreshing application (/) commands...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Successfully reloaded all slash commands!');
  } catch (error) {
    console.error('❌ Failed to deploy commands:', error);
  }
})();