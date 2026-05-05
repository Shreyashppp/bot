const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { errorEmbed, modEmbed } = require('../../utils/embeds');

const DURATION_MAP = {
  '60s': 60,
  '5m': 300,
  '10m': 600,
  '30m': 1800,
  '1h': 3600,
  '6h': 21600,
  '12h': 43200,
  '1d': 86400,
  '7d': 604800,
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Timeout (mute) a member')
    .addUserOption(opt => opt.setName('user').setDescription('User to mute').setRequired(true))
    .addStringOption(opt =>
      opt.setName('duration').setDescription('Duration').setRequired(true)
        .addChoices(
          { name: '60 seconds', value: '60s' },
          { name: '5 minutes', value: '5m' },
          { name: '10 minutes', value: '10m' },
          { name: '30 minutes', value: '30m' },
          { name: '1 hour', value: '1h' },
          { name: '6 hours', value: '6h' },
          { name: '12 hours', value: '12h' },
          { name: '1 day', value: '1d' },
          { name: '7 days', value: '7d' }
        )
    )
    .addStringOption(opt => opt.setName('reason').setDescription('Reason'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction, client) {
    const target = interaction.options.getUser('user');
    const duration = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = interaction.guild.members.cache.get(target.id);

    if (!member)
      return interaction.reply({ embeds: [errorEmbed('That user is not in this server.')], ephemeral: true });
    if (!member.moderatable)
      return interaction.reply({ embeds: [errorEmbed("I can't mute that user.")], ephemeral: true });

    const seconds = DURATION_MAP[duration];
    await member.timeout(seconds * 1000, reason);

    const embed = modEmbed('User Muted', target.tag, interaction.user.tag, reason, 0xFEE75C);
    embed.addFields({ name: 'Duration', value: duration, inline: true });
    await interaction.reply({ embeds: [embed] });
  },
};
