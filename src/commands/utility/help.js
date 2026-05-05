const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require('discord.js');
const { COLORS } = require('../../utils/embeds');

const CATEGORIES = {
  moderation: {
    label: '🛡️ Moderation',
    description: 'Server moderation tools',
    commands: [
      '`/ban` — Ban a member',
      '`/kick` — Kick a member',
      '`/mute` — Timeout a member',
      '`/unmute` — Remove a timeout',
      '`/warn` — Warn a member',
      '`/warnings` — View warnings',
      '`/clearwarnings` — Clear warnings',
      '`/purge` — Bulk delete messages',
      '`/unban` — Unban a user by ID',
    ],
  },
  music: {
    label: '🎵 Music',
    description: 'Play music in voice channels',
    commands: [
      '`/play` — Play a song from YouTube',
      '`/skip` — Skip current song',
      '`/stop` — Stop and clear queue',
      '`/pause` — Pause music',
      '`/resume` — Resume music',
      '`/queue` — View queue',
      '`/nowplaying` — Current song info',
      '`/loop` — Toggle loop',
      '`/volume` — Check/set volume',
    ],
  },
  fun: {
    label: '🎉 Fun',
    description: 'Games and entertainment',
    commands: [
      '`/8ball` — Ask the magic 8-ball',
      '`/coinflip` — Flip a coin',
      '`/dice` — Roll dice',
      '`/trivia` — Answer a trivia question',
      '`/joke` — Get a random joke',
      '`/meme` — Get a random meme',
    ],
  },
  economy: {
    label: '💰 Economy',
    description: 'Virtual economy system',
    commands: [
      '`/balance` — Check your balance',
      '`/daily` — Claim daily reward',
      '`/work` — Work for coins',
      '`/pay` — Transfer coins to someone',
      '`/leaderboard` — Top richest members',
    ],
  },
  roles: {
    label: '🎭 Roles',
    description: 'Role management',
    commands: [
      '`/giverole` — Assign a role to a member',
      '`/removerole` — Remove a role from a member',
      '`/autorole` — Auto-assign role to new members',
    ],
  },
  settings: {
    label: '⚙️ Settings',
    description: 'Server configuration',
    commands: [
      '`/setlog` — Set logging channel',
      '`/setwelcome` — Configure welcome messages',
      '`/testwelcome` — Preview welcome message',
    ],
  },
  utility: {
    label: '🔧 Utility',
    description: 'General utilities',
    commands: [
      '`/ping` — Check bot latency',
      '`/serverinfo` — Server information',
      '`/userinfo` — User information',
      '`/botinfo` — Bot information',
      '`/addcommand` — Add a custom command',
      '`/delcommand` — Delete a custom command',
      '`/listcommands` — List custom commands',
    ],
  },
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Browse all Aetherbot commands'),

  async execute(interaction, client) {
    const mainEmbed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setTitle('🌌 Aetherbot Help')
      .setDescription('Select a category below to view its commands.')
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        Object.values(CATEGORIES).map(cat => ({
          name: cat.label,
          value: cat.description,
          inline: true,
        }))
      )
      .setFooter({ text: `${client.commands.size} commands loaded` })
      .setTimestamp();

    const menu = new StringSelectMenuBuilder()
      .setCustomId('help_category')
      .setPlaceholder('Select a category...')
      .addOptions(
        Object.entries(CATEGORIES).map(([key, cat]) => ({
          label: cat.label.replace(/^\S+\s/, ''),
          description: cat.description,
          value: key,
          emoji: cat.label.split(' ')[0],
        }))
      );

    const row = new ActionRowBuilder().addComponents(menu);
    const msg = await interaction.reply({ embeds: [mainEmbed], components: [row], fetchReply: true });

    const collector = msg.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 60000 });

    collector.on('collect', async (i) => {
      if (i.user.id !== interaction.user.id)
        return i.reply({ content: 'This menu is not for you.', ephemeral: true });

      const key = i.values[0];
      const cat = CATEGORIES[key];

      const embed = new EmbedBuilder()
        .setColor(COLORS.primary)
        .setTitle(cat.label)
        .setDescription(cat.commands.join('\n'))
        .setTimestamp();

      await i.update({ embeds: [embed], components: [row] });
    });

    collector.on('end', () => {
      msg.edit({ components: [] }).catch(() => {});
    });
  },
};
