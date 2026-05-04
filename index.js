require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');

const token = process.env.DISCORD_TOKEN || process.env.TOKEN;

if (!token) {
  console.error('Missing bot token. Set DISCORD_TOKEN (or TOKEN) in your environment.');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages
  ]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));

  if (!command.data || !command.execute) {
    console.warn(`[WARN] Skipping ${file}: missing "data" or "execute" export.`);
    continue;
  }

  client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, readyClient => {
  console.log(`✅ ${readyClient.user.tag} is online and ready.`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);

    if (!command) {
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: 'This command is not available right now.',
          ephemeral: true
        });
      }
      return;
    }

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(
        `[ERROR] Command "${interaction.commandName}" failed in guild "${interaction.guildId}"`,
        error
      );

      const errorResponse = {
        content: 'Something went wrong while running that command. Please try again.',
        ephemeral: true
      };

      if (interaction.deferred || interaction.replied) {
        await interaction.followUp(errorResponse).catch(() => null);
      } else {
        await interaction.reply(errorResponse).catch(() => null);
      }
    }

    return;
  }

  if (!interaction.isStringSelectMenu() && !interaction.isButton()) {
    return;
  }

  const helpCommand = client.commands.get('help');
  if (!helpCommand?.handleComponentInteraction) {
    return;
  }

  try {
    await helpCommand.handleComponentInteraction(interaction);
  } catch (error) {
    console.error('[ERROR] Help component interaction failed', error);

    const errorResponse = {
      content: 'This help panel expired. Run `/help` again.',
      ephemeral: true
    };

    if (interaction.deferred || interaction.replied) {
      await interaction.followUp(errorResponse).catch(() => null);
    } else {
      await interaction.reply(errorResponse).catch(() => null);
    }
  }
});

client.login(token);
