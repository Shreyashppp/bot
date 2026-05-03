const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// 🔥 Create command
const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!')
].map(cmd => cmd.toJSON());

// 🔥 Register command (runs once on start)
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Registering commands...');
    await rest.put(
      Routes.applicationCommands("1500539743161811015"),
      { body: commands }
    );
    console.log('Commands registered!');
  } catch (error) {
    console.error(error);
  }
})();

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('🏓 Pong!');
  }
});

client.on('clientReady', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.TOKEN);
