const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embeds');

module.exports = {
  name: 'botinfo',
  aliases: ['bi', 'about'],
  description: 'View bot information',
  usage: 'botinfo',
  data: new SlashCommandBuilder().setName('botinfo').setDescription('View bot information'),

  async execute(interaction, client) {
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600), m = Math.floor((uptime % 3600) / 60), s = Math.floor(uptime % 60);
    const embed = new EmbedBuilder().setColor(COLORS.primary).setTitle('Aetherbot Info')
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        { name: 'Servers', value: `${client.guilds.cache.size}`, inline: true },
        { name: 'Users', value: `${client.users.cache.size}`, inline: true },
        { name: 'Commands', value: `${client.commands.size} slash + ${client.prefixCommands.size} prefix`, inline: true },
        { name: 'Uptime', value: `${h}h ${m}m ${s}s`, inline: true },
        { name: 'Memory', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true },
        { name: 'Node.js', value: process.version, inline: true }
      ).setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },

  async run(message, args, client) {
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600), m = Math.floor((uptime % 3600) / 60), s = Math.floor(uptime % 60);
    const embed = new EmbedBuilder().setColor(COLORS.primary).setTitle('Aetherbot Info')
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        { name: 'Servers', value: `${client.guilds.cache.size}`, inline: true },
        { name: 'Commands', value: `${client.commands.size}`, inline: true },
        { name: 'Uptime', value: `${h}h ${m}m ${s}s`, inline: true }
      );
    await message.reply({ embeds: [embed] });
  },
};
