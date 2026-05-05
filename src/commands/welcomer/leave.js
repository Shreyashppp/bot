const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  name: 'leave',
  description: 'Configure leave messages',
  usage: 'leave <setchannel|setmessage|enable|disable>',
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Configure leave messages')
    .addSubcommand(s => s.setName('setchannel').setDescription('Set leave channel').addChannelOption(o => o.setName('channel').setDescription('Channel').setRequired(true)))
    .addSubcommand(s => s.setName('setmessage').setDescription('Set leave message').addStringOption(o => o.setName('message').setDescription('Message').setRequired(true)))
    .addSubcommand(s => s.setName('enable').setDescription('Enable leave messages'))
    .addSubcommand(s => s.setName('disable').setDescription('Disable leave messages'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;
    if (sub === 'setchannel') { client.db.setWelcomer(guildId, 'leave_channel', interaction.options.getChannel('channel').id); return interaction.reply({ embeds: [successEmbed('Leave Channel Set', `Set to ${interaction.options.getChannel('channel')}.`)] }); }
    if (sub === 'setmessage') { client.db.setWelcomer(guildId, 'leave_message', interaction.options.getString('message')); return interaction.reply({ embeds: [successEmbed('Leave Message Set', 'Updated.')] }); }
    if (sub === 'enable') { client.db.setWelcomer(guildId, 'leave_enabled', 1); return interaction.reply({ embeds: [successEmbed('Leave Enabled', '✅ Leave messages enabled.')] }); }
    if (sub === 'disable') { client.db.setWelcomer(guildId, 'leave_enabled', 0); return interaction.reply({ embeds: [successEmbed('Leave Disabled', '❌ Leave messages disabled.')] }); }
  },

  async run(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) return message.reply('❌ Missing permissions.');
    const sub = args[0]?.toLowerCase(); const guildId = message.guild.id;
    if (sub === 'setchannel') { const ch = message.mentions.channels.first(); if (ch) { client.db.setWelcomer(guildId, 'leave_channel', ch.id); return message.reply({ embeds: [successEmbed('Leave Channel Set', `Set to ${ch}.`)] }); } }
    if (sub === 'setmessage') { const msg = args.slice(1).join(' '); if (msg) { client.db.setWelcomer(guildId, 'leave_message', msg); return message.reply({ embeds: [successEmbed('Leave Message Set', 'Updated.')] }); } }
    if (sub === 'enable') { client.db.setWelcomer(guildId, 'leave_enabled', 1); return message.reply({ embeds: [successEmbed('Enabled', '✅')] }); }
    if (sub === 'disable') { client.db.setWelcomer(guildId, 'leave_enabled', 0); return message.reply({ embeds: [successEmbed('Disabled', '❌')] }); }
  },
};
