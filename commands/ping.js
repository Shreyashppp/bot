const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check bot status, websocket latency, and response speed.'),
  category: 'utility',

  async execute(interaction) {
    const sentMessage = await interaction.reply({
      content: '🏓 Checking latency...',
      fetchReply: true
    });

    const messageLatency = sentMessage.createdTimestamp - interaction.createdTimestamp;
    const websocketLatency = Math.round(interaction.client.ws.ping);

    const embed = new EmbedBuilder()
      .setColor(0x57f287)
      .setTitle('🏓 Pong!')
      .setDescription('Bot is online and responding normally.')
      .addFields(
        {
          name: 'Message Latency',
          value: `\`${messageLatency}ms\``,
          inline: true
        },
        {
          name: 'WebSocket Latency',
          value: `\`${websocketLatency}ms\``,
          inline: true
        }
      )
      .setTimestamp();

    await interaction.editReply({ content: null, embeds: [embed] });
  }
};
