const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { errorEmbed, modEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server')
    .addUserOption(opt => opt.setName('user').setDescription('User to kick').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for the kick'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction, client) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = interaction.guild.members.cache.get(target.id);

    if (!member)
      return interaction.reply({ embeds: [errorEmbed('That user is not in this server.')], ephemeral: true });
    if (target.id === interaction.user.id)
      return interaction.reply({ embeds: [errorEmbed("You can't kick yourself.")], ephemeral: true });
    if (!member.kickable)
      return interaction.reply({ embeds: [errorEmbed("I don't have permission to kick that user.")], ephemeral: true });
    if (member.roles.highest.position >= interaction.member.roles.highest.position)
      return interaction.reply({ embeds: [errorEmbed("You can't kick someone with an equal or higher role.")], ephemeral: true });

    try {
      await member.kick(reason);
      await interaction.reply({ embeds: [modEmbed('User Kicked', target.tag, interaction.user.tag, reason, 0xFEE75C)] });
    } catch (err) {
      await interaction.reply({ embeds: [errorEmbed(`Failed to kick: ${err.message}`)], ephemeral: true });
    }
  },
};
