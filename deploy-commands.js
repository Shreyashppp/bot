require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');

const token = process.env.DISCORD_TOKEN || process.env.TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID || process.env.CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID || process.env.GUILD_ID;

if (!token || !clientId) {
  console.error(
    'Missing credentials. You need DISCORD_TOKEN and DISCORD_CLIENT_ID (legacy TOKEN/CLIENT_ID also supported).'
  );
  process.exit(1);
}

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const commands = [];

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));

  if (!command.data) {
    console.warn(`[WARN] Skipping ${file}: missing "data" export.`);
    continue;
  }

  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands...`);

    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commands
      });
      console.log(`✅ Reloaded ${commands.length} guild commands for guild ${guildId}.`);
      return;
    }

    await rest.put(Routes.applicationCommands(clientId), {
      body: commands
    });

    console.log(`✅ Reloaded ${commands.length} global commands.`);
  } catch (error) {
    console.error('Failed to deploy commands:', error);
    process.exit(1);
  }
})();
