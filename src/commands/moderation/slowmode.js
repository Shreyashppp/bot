const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  name: 'slowmode',
  aliases: ['slow', 'sm'],
  description: 'Set slowmode for a channel',
  usage: 'slowmode <seconds>',
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set slowmode for a channel')
    .addIntegerOption(o => o.setName('seconds').setDescription('Seconds (0 to disable)').setRequired(true).setMinValue(0).setMaxValue(21600))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction, client) {
    const secs = interaction.options.getInteger('seconds');
    try {
      await interaction.channel.setRateLimitPerUser(secs);
      await interaction.reply({ embeds: [successEmbed('Slowmode Set', secs === 0 ? 'Slowmode disabled.' : `Slowmode set to **${secs}** second(s).`)] });
    } catch {
      await interaction.reply({ embeds: [errorEmbed('Could not set slowmode.')], flags: 64 });
    }
  },

  async run(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) return message.reply('❌ Missing permissions.');
    const secs = parseInt(args[0]);
    if (isNaN(secs) || secs < 0 || secs > 21600) return message.reply('❌ Provide a number between 0 and 21600.');
    try {
      await message.channel.setRateLimitPerUser(secs);
      await message.reply({ embeds: [successEmbed('Slowmode Set', secs === 0 ? 'Slowmode disabled.' : `Slowmode set to **${secs}** second(s).`)] });
    } catch {
      await message.reply('❌ Could not set slowmode.');
    }
  },
};
