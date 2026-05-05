const { SlashCommandBuilder, EmbedBuilder, version: djsVersion } = require('discord.js');
const { COLORS } = require('../../utils/embeds');
const { execSync } = require('child_process');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Display information about Aetherbot'),

  async execute(interaction, client) {
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const uptimeStr = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    const memUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);

    const embed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setTitle('🤖 Aetherbot')
      .setDescription('A professional all-in-one Discord bot.')
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        { name: '👤 Developer', value: 'Custom Build', inline: true },
        { name: '📚 Library', value: `discord.js v${djsVersion}`, inline: true },
        { name: '⚙️ Runtime', value: `Node.js ${process.version}`, inline: true },
        { name: '🌐 Servers', value: `${client.guilds.cache.size}`, inline: true },
        { name: '🏓 Ping', value: `${client.ws.ping}ms`, inline: true },
        { name: '💾 Memory', value: `${memUsed} MB`, inline: true },
        { name: '⏱️ Uptime', value: uptimeStr, inline: true },
        { name: '🔧 Commands', value: `${client.commands.size}`, inline: true },
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
