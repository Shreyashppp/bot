require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

// Load commands
const files = fs.readdirSync('./commands');
for (const file of files) {
  const cmd = require(`./commands/${file}`);
  client.commands.set(cmd.name, cmd);
}

client.once('ready', () => {
  console.log("Bot Online ✅");
});

client.on('interactionCreate', async interaction => {

  if (interaction.isChatInputCommand()) {
    const cmd = client.commands.get(interaction.commandName);
    if (cmd) await cmd.execute(interaction);
  }

  if (interaction.isStringSelectMenu() || interaction.isButton()) {
    const help = client.commands.get('help');
    if (help?.handleMenuInteraction) {
      await help.handleMenuInteraction(interaction);
    }
  }
});

client.login(process.env.TOKEN);
