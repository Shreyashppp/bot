const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Remove a timeout from a member')
    .addUserOption(opt => opt.setName('user').setDescription('User to unmute').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction, client) {
    const target = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(target.id);

    if (!member)
      return interaction.reply({ embeds: [errorEmbed('That user is not in this server.')], ephemeral: true });
    if (!member.isCommunicationDisabled())
      return interaction.reply({ embeds: [errorEmbed('That user is not muted.')], ephemeral: true });

    await member.timeout(null);
    await interaction.reply({ embeds: [successEmbed('User Unmuted', `${target.tag} has been unmuted by ${interaction.user.tag}.`)] });
  },
};
