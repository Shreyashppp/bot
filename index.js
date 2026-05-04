require('./deploy-commands.js'); // register slash commands

const { Client, GatewayIntentBits, Collection } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

// Load commands
const fs = require('fs');
const files = fs.readdirSync('./commands');

for (const file of files) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Ready event
client.once('clientReady', () => {
  console.log("Bot Online ✅");
});

// Handle slash commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const cmd = client.commands.get(interaction.commandName);
  if (!cmd) return;

  try {
    // 👇 IMPORTANT: pass client for auto help
    await cmd.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "❌ Error while executing command",
      ephemeral: true
    });
  }
});

// Login
client.login(process.env.TOKEN);
