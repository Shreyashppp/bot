const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check bot latency'),
  
  async execute(interaction) {
    const sent = await interaction.editReply({ content: 'Pinging...' });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(`🏓 Pong! Latency: ${latency}ms | API: ${Math.round(interaction.client.ws.ping)}ms`);
  }
};