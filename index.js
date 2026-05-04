require('./deploy-commands.js'); // auto register commands

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

client.once('ready', () => {
  console.log("Bot Online");
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const cmd = client.commands.get(interaction.commandName);
  if (!cmd) return;

  await cmd.execute({
    reply: (msg) => interaction.reply(msg)
  });
});

client.login(process.env.TOKEN);
