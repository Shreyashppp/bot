const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embeds');

module.exports = {
  name: 'uptime',
  aliases: ['up'],
  description: 'Show bot uptime',
  usage: 'uptime',
  data: new SlashCommandBuilder().setName('uptime').setDescription('Show bot uptime'),

  async execute(interaction, client) {
    const uptime = process.uptime();
    const d = Math.floor(uptime / 86400), h = Math.floor((uptime % 86400) / 3600), m = Math.floor((uptime % 3600) / 60), s = Math.floor(uptime % 60);
    await interaction.reply({ embeds: [new EmbedBuilder().setColor(COLORS.primary).setTitle('⏱️ Uptime').setDescription(`**${d}d ${h}h ${m}m ${s}s**`).setTimestamp()] });
  },

  async run(message, args, client) {
    const uptime = process.uptime();
    const d = Math.floor(uptime / 86400), h = Math.floor((uptime % 86400) / 3600), m = Math.floor((uptime % 3600) / 60), s = Math.floor(uptime % 60);
    await message.reply({ embeds: [new EmbedBuilder().setColor(COLORS.primary).setTitle('⏱️ Uptime').setDescription(`**${d}d ${h}h ${m}m ${s}s**`)] });
  },
};
