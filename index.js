require('./deploy-commands.js');

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

// Bot ready
client.once('clientReady', () => {
  console.log("Bot Online ✅");
});

// Interaction handler (ALL IN ONE)
client.on('interactionCreate', async interaction => {

  // 🔹 SLASH COMMANDS
  if (interaction.isChatInputCommand()) {
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return;

    try {
      await cmd.execute(interaction, client);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "❌ Error while executing command",
        ephemeral: true
      });
    }
  }

  // 🔹 DROPDOWN MENU (HELP)
  if (interaction.isStringSelectMenu()) {

    if (interaction.customId === "help-menu") {

      if (interaction.values[0] === "moderation") {
        const embed = {
          title: "🛡️ Moderation Commands",
          description: `
🔹 /ban
🔹 /kick
🔹 /mute
🔹 /purge
          `,
          color: 0xff0000
        };

        return interaction.update({ embeds: [embed] });
      }

      if (interaction.values[0] === "utility") {
        const embed = {
          title: "⚙️ Utility Commands",
          description: `
🔹 /ping
🔹 /help
          `,
          color: 0x00ff00
        };

        return interaction.update({ embeds: [embed] });
      }
    }
  }
});

// Login
client.login(process.env.TOKEN);
