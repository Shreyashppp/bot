const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
  console.log("Bot Online");
});

// 🔥 REPLACE THIS LINE ONLY
client.login("MTUwMDUzOTc0MzE2MTgxMTAxNQ.GRZeM8.OLNERe7jTcpZoPYl-4_1RlZNf-jUUQpJHt4Tag");
