const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giverole')
    .setDescription('Give a role to a member')
    .addUserOption(opt => opt.setName('user').setDescription('Target user').setRequired(true))
    .addRoleOption(opt => opt.setName('role').setDescription('Role to give').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction, client) {
    const target = interaction.options.getMember('user');
    const role = interaction.options.getRole('role');

    if (!target)
      return interaction.reply({ embeds: [errorEmbed('Could not find that member.')], ephemeral: true });
    if (role.position >= interaction.guild.members.me.roles.highest.position)
      return interaction.reply({ embeds: [errorEmbed("That role is higher than or equal to my highest role. I can't assign it.")], ephemeral: true });
    if (role.managed)
      return interaction.reply({ embeds: [errorEmbed('That role is managed by an integration and cannot be assigned manually.')], ephemeral: true });
    if (target.roles.cache.has(role.id))
      return interaction.reply({ embeds: [errorEmbed(`${target.user.tag} already has the ${role.name} role.`)], ephemeral: true });

    await target.roles.add(role);
    await interaction.reply({ embeds: [successEmbed('Role Assigned', `${role} has been given to ${target}.`)] });
  },
};
