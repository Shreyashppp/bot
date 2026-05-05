const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed, modEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server')
    .addUserOption(opt => opt.setName('user').setDescription('User to ban').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for the ban'))
    .addIntegerOption(opt => opt.setName('days').setDescription('Days of messages to delete (0-7)').setMinValue(0).setMaxValue(7))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction, client) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const days = interaction.options.getInteger('days') ?? 0;
    const member = interaction.guild.members.cache.get(target.id);

    if (target.id === interaction.user.id)
      return interaction.reply({ embeds: [errorEmbed("You can't ban yourself.")], ephemeral: true });

    if (member && !member.bannable)
      return interaction.reply({ embeds: [errorEmbed("I don't have permission to ban that user.")], ephemeral: true });

    if (member && member.roles.highest.position >= interaction.member.roles.highest.position)
      return interaction.reply({ embeds: [errorEmbed("You can't ban someone with an equal or higher role.")], ephemeral: true });

    try {
      await interaction.guild.members.ban(target.id, { reason, deleteMessageDays: days });
      const embed = modEmbed('User Banned', target.tag, interaction.user.tag, reason);
      embed.addFields({ name: 'Messages Deleted', value: `${days} day(s)`, inline: true });
      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      await interaction.reply({ embeds: [errorEmbed(`Failed to ban: ${err.message}`)], ephemeral: true });
    }
  },
};
