const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  name: 'unlock',
  description: 'Unlock a channel',
  usage: 'unlock [channel]',
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Unlock a channel')
    .addChannelOption(o => o.setName('channel').setDescription('Channel to unlock (default: current)'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction, client) {
    const channel = interaction.options.getChannel('channel') || interaction.channel;
    try {
      await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: null });
      await interaction.reply({ embeds: [successEmbed('Channel Unlocked', `🔓 ${channel} has been unlocked.`)] });
    } catch {
      await interaction.reply({ embeds: [errorEmbed('Could not unlock that channel.')], ephemeral: true });
    }
  },

  async run(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) return message.reply('❌ Missing permissions.');
    const channel = message.mentions.channels.first() || message.channel;
    try {
      await channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: null });
      await message.reply({ embeds: [successEmbed('Channel Unlocked', `🔓 ${channel} has been unlocked.`)] });
    } catch {
      await message.reply('❌ Could not unlock that channel.');
    }
  },
};
