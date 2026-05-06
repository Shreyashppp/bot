const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  name: 'lock',
  description: 'Lock a channel',
  usage: 'lock [channel]',
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock a channel')
    .addChannelOption(o => o.setName('channel').setDescription('Channel to lock (default: current)'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction, client) {
    const channel = interaction.options.getChannel('channel') || interaction.channel;
    try {
      await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false });
      await interaction.reply({ embeds: [successEmbed('Channel Locked', `🔒 ${channel} has been locked.`)] });
    } catch {
      await interaction.reply({ embeds: [errorEmbed('Could not lock that channel.')], flags: 64 });
    }
  },

  async run(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) return message.reply('❌ Missing permissions.');
    const channel = message.mentions.channels.first() || message.channel;
    try {
      await channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: false });
      await message.reply({ embeds: [successEmbed('Channel Locked', `🔒 ${channel} has been locked.`)] });
    } catch {
      await message.reply('❌ Could not lock that channel.');
    }
  },
};
