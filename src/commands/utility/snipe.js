const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS, errorEmbed } = require('../../utils/embeds');

module.exports = {
  name: 'snipe',
  aliases: ['s'],
  description: 'Show last deleted message in this channel',
  usage: 'snipe',
  data: new SlashCommandBuilder().setName('snipe').setDescription('Show last deleted message in this channel'),

  async execute(interaction, client) {
    const snipe = client.db.getSnipe(interaction.channel.id);
    if (!snipe) return interaction.reply({ embeds: [errorEmbed('No deleted messages found.')], flags: 64 });
    const embed = new EmbedBuilder().setColor(COLORS.primary)
      .setTitle('🗑️ Sniped Message')
      .setDescription(snipe.content)
      .setFooter({ text: `By ${snipe.author_tag}` })
      .setTimestamp(snipe.timestamp);
    await interaction.reply({ embeds: [embed] });
  },

  async run(message, args, client) {
    const snipe = client.db.getSnipe(message.channel.id);
    if (!snipe) return message.reply({ embeds: [errorEmbed('No deleted messages found.')] });
    const embed = new EmbedBuilder().setColor(COLORS.primary)
      .setTitle('🗑️ Sniped Message')
      .setDescription(snipe.content)
      .setFooter({ text: `By ${snipe.author_tag}` })
      .setTimestamp(snipe.timestamp);
    await message.reply({ embeds: [embed] });
  },
};
