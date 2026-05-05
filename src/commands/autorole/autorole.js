const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { successEmbed, errorEmbed, COLORS } = require('../../utils/embeds');

module.exports = {
  name: 'autorole',
  aliases: ['ar'],
  description: 'Manage auto-assigned roles for new members',
  usage: 'autorole <add|remove|list>',
  data: new SlashCommandBuilder()
    .setName('autorole')
    .setDescription('Manage auto-assigned roles')
    .addSubcommand(s => s.setName('add').setDescription('Add an autorole')
      .addRoleOption(o => o.setName('role').setDescription('Role to auto-assign').setRequired(true))
      .addStringOption(o => o.setName('type').setDescription('Who to give it to').addChoices({ name: 'All Members', value: 'all' }, { name: 'Humans Only', value: 'human' }, { name: 'Bots Only', value: 'bot' })))
    .addSubcommand(s => s.setName('remove').setDescription('Remove an autorole').addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true)))
    .addSubcommand(s => s.setName('list').setDescription('List all autoroles'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;
    if (sub === 'add') {
      const role = interaction.options.getRole('role');
      const type = interaction.options.getString('type') || 'all';
      client.db.addAutorole(guildId, role.id, type);
      return interaction.reply({ embeds: [successEmbed('Autorole Added', `${role} will be given to **${type}** members on join.`)] });
    }
    if (sub === 'remove') {
      const role = interaction.options.getRole('role');
      client.db.removeAutorole(guildId, role.id);
      return interaction.reply({ embeds: [successEmbed('Autorole Removed', `${role} removed from autoroles.`)] });
    }
    if (sub === 'list') {
      const roles = client.db.getAutoroles(guildId);
      return interaction.reply({ embeds: [new EmbedBuilder().setColor(COLORS.primary).setTitle('🎭 Autoroles').setDescription(roles.length ? roles.map(r => `<@&${r.role_id}> — \`${r.type}\``).join('\n') : 'No autoroles set.')] });
    }
  },

  async run(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) return message.reply('❌ Missing permissions.');
    const sub = args[0]?.toLowerCase(); const guildId = message.guild.id;
    if (sub === 'add') {
      const role = message.mentions.roles.first();
      if (!role) return message.reply('❌ Mention a role.');
      client.db.addAutorole(guildId, role.id, args[2] || 'all');
      return message.reply({ embeds: [successEmbed('Autorole Added', `${role} added.`)] });
    }
    if (sub === 'remove') {
      const role = message.mentions.roles.first();
      if (!role) return message.reply('❌ Mention a role.');
      client.db.removeAutorole(guildId, role.id);
      return message.reply({ embeds: [successEmbed('Autorole Removed', `${role} removed.`)] });
    }
    const roles = client.db.getAutoroles(guildId);
    return message.reply({ embeds: [new EmbedBuilder().setColor(COLORS.primary).setTitle('🎭 Autoroles').setDescription(roles.length ? roles.map(r => `<@&${r.role_id}> — \`${r.type}\``).join('\n') : 'None.')] });
  },
};
