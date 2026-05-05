const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed, infoEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autorole')
    .setDescription('Set a role to auto-assign to new members')
    .addRoleOption(opt => opt.setName('role').setDescription('Role to auto-assign (leave empty to disable)'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction, client) {
    const role = interaction.options.getRole('role');

    if (!role) {
      client.db.setAutorole(interaction.guild.id, null);
      return interaction.reply({ embeds: [successEmbed('Autorole Disabled', 'New members will no longer be automatically assigned a role.')] });
    }

    if (role.position >= interaction.guild.members.me.roles.highest.position)
      return interaction.reply({ embeds: [errorEmbed("That role is higher than or equal to my highest role.")], ephemeral: true });
    if (role.managed)
      return interaction.reply({ embeds: [errorEmbed('That role is managed by an integration.')], ephemeral: true });

    client.db.setAutorole(interaction.guild.id, role.id);
    await interaction.reply({ embeds: [successEmbed('Autorole Set', `New members will automatically receive the ${role} role.`)] });
  },
};
