const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  name: 'setlog',
  aliases: ['logchannel'],
  description: 'Set the log channel',
  usage: 'setlog <channel>',
  data: new SlashCommandBuilder()
    .setName('setlog')
    .setDescription('Set the log channel')
    .addChannelOption(o => o.setName('channel').setDescription('Log channel').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction, client) {
    const channel = interaction.options.getChannel('channel');
    client.db.setLogChannel(interaction.guild.id, channel.id);
    return interaction.reply({ embeds: [successEmbed('Log Channel Set', `Logs will be sent to ${channel}.`)] });
  },

  async run(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) return message.reply('❌ Missing permissions.');
    const channel = message.mentions.channels.first();
    if (!channel) return message.reply('❌ Mention a channel.');
    client.db.setLogChannel(message.guild.id, channel.id);
    return message.reply({ embeds: [successEmbed('Log Channel Set', `Logs will be sent to ${channel}.`)] });
  },
};
