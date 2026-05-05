const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check bot latency and API response time'),

  async execute(interaction, client) {
    const sent = await interaction.deferReply({ fetchReply: true });
    const roundtrip = sent.createdTimestamp - interaction.createdTimestamp;
    const ws = client.ws.ping;

    const getStatus = (ms) => ms < 100 ? '🟢 Excellent' : ms < 200 ? '🟡 Good' : ms < 400 ? '🟠 Fair' : '🔴 Poor';

    const embed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setTitle('🏓 Pong!')
      .addFields(
        { name: 'Roundtrip', value: `\`${roundtrip}ms\` ${getStatus(roundtrip)}`, inline: true },
        { name: 'WebSocket', value: `\`${ws}ms\` ${getStatus(ws)}`, inline: true },
      )
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
