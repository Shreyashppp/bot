const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
  console.log("Bot Online");
});

// 👇 ADD THIS LINE HERE
console.log("MTUwMDUzOTc0MzE2MTgxMTAxNQ.GRZeM8.OLNERe7jTcpZoPYl-4_1RlZNf-jUUQpJHt4Tag:", process.env.TOKEN);

client.login(process.env.TOKEN);
