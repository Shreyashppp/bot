require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Collection();

client.once('ready', () => {
  console.log(`🚀 ${client.user.tag} is now online and fresh!`);
});

client.login(process.env.DISCORD_TOKEN);
