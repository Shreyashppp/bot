const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user by their ID')
    .addStringOption(opt => opt.setName('userid').setDescription('User ID to unban').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for unban'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction, client) {
    const userId = interaction.options.getString('userid');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    try {
      const ban = await interaction.guild.bans.fetch(userId);
      if (!ban)
        return interaction.reply({ embeds: [errorEmbed('That user is not banned.')], ephemeral: true });

      await interaction.guild.members.unban(userId, reason);
      await interaction.reply({ embeds: [successEmbed('User Unbanned', `**${ban.user.tag}** has been unbanned.\n**Reason:** ${reason}`)] });
    } catch (err) {
      await interaction.reply({ embeds: [errorEmbed(`Could not find a ban for ID \`${userId}\`.`)], ephemeral: true });
    }
  },
};
