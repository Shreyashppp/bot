const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removerole')
    .setDescription('Remove a role from a member')
    .addUserOption(opt => opt.setName('user').setDescription('Target user').setRequired(true))
    .addRoleOption(opt => opt.setName('role').setDescription('Role to remove').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction, client) {
    const target = interaction.options.getMember('user');
    const role = interaction.options.getRole('role');

    if (!target)
      return interaction.reply({ embeds: [errorEmbed('Could not find that member.')], ephemeral: true });
    if (role.position >= interaction.guild.members.me.roles.highest.position)
      return interaction.reply({ embeds: [errorEmbed("That role is higher than or equal to my highest role.")], ephemeral: true });
    if (!target.roles.cache.has(role.id))
      return interaction.reply({ embeds: [errorEmbed(`${target.user.tag} doesn't have the ${role.name} role.`)], ephemeral: true });

    await target.roles.remove(role);
    await interaction.reply({ embeds: [successEmbed('Role Removed', `${role} has been removed from ${target}.`)] });
  },
};
