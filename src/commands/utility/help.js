const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require('discord.js');
const { COLORS } = require('../../utils/embeds');

const MAIN_MENU = {
  moderation: {
    emoji: '🛡️',
    label: 'Moderation',
    description: 'View commands in Moderation category',
    commands: [
      '`/ban` — Ban a member from the server',
      '`/kick` — Kick a member from the server',
      '`/mute` — Timeout a member',
      '`/unmute` — Remove a timeout from a member',
      '`/warn` — Issue a warning to a member',
      '`/warnings` — View warnings for a member',
      '`/clearwarnings` — Clear all warnings for a member',
      '`/purge` — Bulk delete messages in a channel',
      '`/unban` — Unban a user by ID',
    ],
  },
  music: {
    emoji: '🎵',
    label: 'Music',
    description: 'View commands in Music category',
    commands: [
      '`/play` — Play a song from YouTube',
      '`/skip` — Skip the current song',
      '`/stop` — Stop playback and clear the queue',
      '`/pause` — Pause the current song',
      '`/resume` — Resume paused music',
      '`/queue` — View the current queue',
      '`/nowplaying` — Show what\'s currently playing',
      '`/loop` — Toggle loop mode',
      '`/volume` — Check or set the volume',
    ],
  },
  economy: {
    emoji: '💰',
    label: 'Economy',
    description: 'View commands in Economy category',
    commands: [
      '`/balance` — Check your coin balance',
      '`/daily` — Claim your daily reward',
      '`/work` — Work to earn coins',
      '`/pay` — Transfer coins to another member',
      '`/leaderboard` — View the richest members',
    ],
  },
  roles: {
    emoji: '🎭',
    label: 'Roles',
    description: 'View commands in Roles category',
    commands: [
      '`/giverole` — Assign a role to a member',
      '`/removerole` — Remove a role from a member',
      '`/autorole` — Auto-assign a role to new members',
    ],
  },
};

const OTHER_MENU = {
  fun: {
    emoji: '🎉',
    label: 'Fun',
    description: 'View commands in Fun category',
    commands: [
      '`/8ball` — Ask the magic 8-ball a question',
      '`/coinflip` — Flip a coin',
      '`/dice` — Roll a dice',
      '`/trivia` — Answer a trivia question',
      '`/joke` — Get a random joke',
      '`/meme` — Get a random meme',
    ],
  },
  settings: {
    emoji: '⚙️',
    label: 'Settings',
    description: 'View commands in Settings category',
    commands: [
      '`/setlog` — Set the logging channel',
      '`/setwelcome` — Configure welcome messages',
      '`/testwelcome` — Preview the welcome message',
    ],
  },
  utility: {
    emoji: '🔧',
    label: 'Utility',
    description: 'View commands in Utility category',
    commands: [
      '`/ping` — Check bot latency',
      '`/serverinfo` — View server information',
      '`/userinfo` — View user information',
      '`/botinfo` — View bot information',
      '`/addcommand` — Add a custom command',
      '`/delcommand` — Delete a custom command',
      '`/listcommands` — List all custom commands',
    ],
  },
};

const ALL_CATEGORIES = { ...MAIN_MENU, ...OTHER_MENU };

function buildMainEmbed(client) {
  const totalCommands = client.commands.size;

  const mainList = Object.values(MAIN_MENU)
    .map(c => `${c.emoji} **: ${c.label}**`)
    .join('\n');

  const otherList = Object.values(OTHER_MENU)
    .map(c => `${c.emoji} **: ${c.label}**`)
    .join('\n');

  return new EmbedBuilder()
    .setColor(0xe74c3c)
    .setTitle('AETHERBOT HELP MENU')
    .setThumbnail(client.user.displayAvatarURL())
    .setDescription(
      `**Prefix** \`/\`\n` +
      `**Total Commands: ${totalCommands}**\n\n` +
      `\`\`\`/help <command> for more info regarding that command!\nExample: /help ban\`\`\``
    )
    .addFields(
      { name: '**Main Menu**', value: mainList, inline: true },
      { name: '**Others Menu**', value: otherList, inline: true }
    )
    .setFooter({ text: 'Select a category from the menus below to view its commands.' });
}

function buildCategoryEmbed(cat, menuTitle) {
  return new EmbedBuilder()
    .setColor(0xe74c3c)
    .setTitle(`${menuTitle}`)
    .setDescription(cat.commands.join('\n'))
    .setFooter({ text: `${cat.emoji} ${cat.label} — Use /help for the full menu` });
}

function buildComponents(disabledAll = false) {
  const mainMenuSelect = new StringSelectMenuBuilder()
    .setCustomId('help_main')
    .setPlaceholder('Main Menu')
    .setDisabled(disabledAll)
    .addOptions(
      Object.entries(MAIN_MENU).map(([key, cat]) => ({
        label: cat.label,
        description: cat.description,
        value: key,
        emoji: cat.emoji,
      }))
    );

  const otherMenuSelect = new StringSelectMenuBuilder()
    .setCustomId('help_other')
    .setPlaceholder('Other Menu')
    .setDisabled(disabledAll)
    .addOptions(
      Object.entries(OTHER_MENU).map(([key, cat]) => ({
        label: cat.label,
        description: cat.description,
        value: key,
        emoji: cat.emoji,
      }))
    );

  const backButton = new ButtonBuilder()
    .setCustomId('help_back')
    .setLabel('Back to Menu')
    .setStyle(ButtonStyle.Danger)
    .setDisabled(disabledAll);

  const supportButton = new ButtonBuilder()
    .setLabel('Support Server')
    .setStyle(ButtonStyle.Link)
    .setURL('https://discord.gg/aetherbot')
    .setEmoji('🔗');

  const row1 = new ActionRowBuilder().addComponents(mainMenuSelect);
  const row2 = new ActionRowBuilder().addComponents(otherMenuSelect);
  const row3 = new ActionRowBuilder().addComponents(backButton, supportButton);

  return [row1, row2, row3];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Browse all Aetherbot commands'),

  async execute(interaction, client) {
    const mainEmbed = buildMainEmbed(client);
    const components = buildComponents();

    const msg = await interaction.reply({
      embeds: [mainEmbed],
      components,
      fetchReply: true,
    });

    const collector = msg.createMessageComponentCollector({
      time: 120000,
    });

    collector.on('collect', async (i) => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({ content: 'This menu is not for you.', ephemeral: true });
      }

      if (i.customId === 'help_back') {
        await i.update({
          embeds: [buildMainEmbed(client)],
          components: buildComponents(),
        });
        return;
      }

      if (i.componentType === ComponentType.StringSelect) {
        const key = i.values[0];
        const cat = ALL_CATEGORIES[key];
        const menuTitle = MAIN_MENU[key] ? 'Main Menu' : 'Other Menu';

        await i.update({
          embeds: [buildCategoryEmbed(cat, menuTitle)],
          components: buildComponents(),
        });
      }
    });

    collector.on('end', () => {
      msg.edit({ components: buildComponents(true) }).catch(() => {});
    });
  },
};
