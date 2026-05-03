const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
  console.log("Bot Online");
});

// ✅ correct debug
console.log("TOKEN:", process.env.TOKEN);

client.login(process.env.TOKEN);
