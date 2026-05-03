const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
  console.log("Bot Online");
});

// 🔥 REPLACE THIS LINE ONLY
client.login(process.env.TOKEN);
