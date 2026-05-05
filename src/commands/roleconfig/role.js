const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { successEmbed, errorEmbed, COLORS } = require('../../utils/embeds');

module.exports = {
  name: 'role',
  aliases: ['r'],
  description: 'Role management commands',
  usage: 'role <give|remove|create|delete|info|color|rename|all>',
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Role management commands')
    .addSubcommand(s => s.setName('give').setDescription('Give a role to a member').addUserOption(o => o.setName('user').setDescription('User').setRequired(true)).addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true)))
    .addSubcommand(s => s.setName('remove').setDescription('Remove a role from a member').addUserOption(o => o.setName('user').setDescription('User').setRequired(true)).addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true)))
    .addSubcommand(s => s.setName('create').setDescription('Create a new role').addStringOption(o => o.setName('name').setDescription('Role name').setRequired(true)).addStringOption(o => o.setName('color').setDescription('Hex color (e.g. #FF0000)')))
    .addSubcommand(s => s.setName('delete').setDescription('Delete a role').addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true)))
    .addSubcommand(s => s.setName('info').setDescription('View role info').addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true)))
    .addSubcommand(s => s.setName('color').setDescription('Change role color').addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true)).addStringOption(o => o.setName('color').setDescription('Hex color').setRequired(true)))
    .addSubcommand(s => s.setName('rename').setDescription('Rename a role').addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true)).addStringOption(o => o.setName('name').setDescription('New name').setRequired(true)))
    .addSubcommand(s => s.setName('all').setDescription('Give a role to all members').addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'give') {
      const member = interaction.options.getMember('user');
      const role = interaction.options.getRole('role');
      await member.roles.add(role);
      return interaction.reply({ embeds: [successEmbed('Role Given', `${role} given to ${member}.`)] });
    }
    if (sub === 'remove') {
      const member = interaction.options.getMember('user');
      const role = interaction.options.getRole('role');
      await member.roles.remove(role);
      return interaction.reply({ embeds: [successEmbed('Role Removed', `${role} removed from ${member}.`)] });
    }
    if (sub === 'create') {
      const name = interaction.options.getString('name');
      const color = interaction.options.getString('color') || null;
      const role = await interaction.guild.roles.create({ name, color: color || undefined });
      return interaction.reply({ embeds: [successEmbed('Role Created', `${role} created.`)] });
    }
    if (sub === 'delete') {
      const role = interaction.options.getRole('role');
      await role.delete();
      return interaction.reply({ embeds: [successEmbed('Role Deleted', `**${role.name}** deleted.`)] });
    }
    if (sub === 'info') {
      const role = interaction.options.getRole('role');
      return interaction.reply({ embeds: [new EmbedBuilder().setColor(role.color || COLORS.primary).setTitle(`Role: ${role.name}`).addFields(
        { name: 'ID', value: role.id, inline: true },
        { name: 'Color', value: role.hexColor, inline: true },
        { name: 'Members', value: `${role.members.size}`, inline: true },
        { name: 'Hoisted', value: role.hoist ? 'Yes' : 'No', inline: true },
        { name: 'Mentionable', value: role.mentionable ? 'Yes' : 'No', inline: true },
        { name: 'Position', value: `${role.position}`, inline: true },
        { name: 'Created', value: `<t:${Math.floor(role.createdTimestamp / 1000)}:R>`, inline: true }
      )] });
    }
    if (sub === 'color') {
      const role = interaction.options.getRole('role');
      const color = interaction.options.getString('color');
      await role.setColor(color);
      return interaction.reply({ embeds: [successEmbed('Color Changed', `${role} color changed to **${color}**.`)] });
    }
    if (sub === 'rename') {
      const role = interaction.options.getRole('role');
      const name = interaction.options.getString('name');
      await role.setName(name);
      return interaction.reply({ embeds: [successEmbed('Role Renamed', `Role renamed to **${name}**.`)] });
    }
    if (sub === 'all') {
      const role = interaction.options.getRole('role');
      await interaction.deferReply();
      const members = await interaction.guild.members.fetch();
      let count = 0;
      for (const [, member] of members) {
        if (!member.roles.cache.has(role.id)) { await member.roles.add(role).catch(() => {}); count++; }
      }
      return interaction.editReply({ embeds: [successEmbed('Role Given to All', `${role} given to **${count}** members.`)] });
    }
  },

  async run(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) return message.reply('❌ Missing permissions.');
    const sub = args[0]?.toLowerCase();
    if (sub === 'give') {
      const member = message.mentions.members.first();
      const role = message.mentions.roles.first();
      if (!member || !role) return message.reply('❌ Mention a user and a role.');
      await member.roles.add(role);
      return message.reply({ embeds: [successEmbed('Role Given', `${role} given to ${member}.`)] });
    }
    if (sub === 'remove') {
      const member = message.mentions.members.first();
      const role = message.mentions.roles.first();
      if (!member || !role) return message.reply('❌ Mention a user and a role.');
      await member.roles.remove(role);
      return message.reply({ embeds: [successEmbed('Role Removed', `${role} removed from ${member}.`)] });
    }
    if (sub === 'create') {
      const name = args.slice(1).join(' ');
      if (!name) return message.reply('❌ Provide a role name.');
      const role = await message.guild.roles.create({ name });
      return message.reply({ embeds: [successEmbed('Role Created', `${role} created.`)] });
    }
    return message.reply('Usage: `.role <give|remove|create|delete|info|color|rename|all>`');
  },
};
