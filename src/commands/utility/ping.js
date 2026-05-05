const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embeds');

module.exports = {
  name: 'ping',
  description: 'Check bot latency',
  usage: 'ping',
  data: new SlashCommandBuilder().setName('ping').setDescription('Check bot latency'),

  async execute(interaction, client) {
    const sent = await interaction.reply({ content: '🏓 Pinging...', fetchReply: true });
    const embed = new EmbedBuilder().setColor(COLORS.primary).setTitle('🏓 Pong!')
      .addFields(
        { name: 'Bot Latency', value: `${sent.createdTimestamp - interaction.createdTimestamp}ms`, inline: true },
        { name: 'API Latency', value: `${Math.round(client.ws.ping)}ms`, inline: true }
      );
    await interaction.editReply({ content: null, embeds: [embed] });
  },

  async run(message, args, client) {
    const msg = await message.reply('🏓 Pinging...');
    const embed = new EmbedBuilder().setColor(COLORS.primary).setTitle('🏓 Pong!')
      .addFields(
        { name: 'Bot Latency', value: `${msg.createdTimestamp - message.createdTimestamp}ms`, inline: true },
        { name: 'API Latency', value: `${Math.round(client.ws.ping)}ms`, inline: true }
      );
    await msg.edit({ content: null, embeds: [embed] });
  },
};
