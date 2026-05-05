const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your or another user\'s balance')
    .addUserOption(opt => opt.setName('user').setDescription('User to check (default: yourself)')),

  async execute(interaction, client) {
    const target = interaction.options.getUser('user') || interaction.user;
    const economy = client.db.getBalance(interaction.guild.id, target.id);

    const embed = new EmbedBuilder()
      .setColor(COLORS.economy)
      .setTitle('💰 Balance')
      .setDescription(`**${target.username}**'s wallet`)
      .addFields({ name: '🪙 Coins', value: `**${economy.balance.toLocaleString()}**` })
      .setThumbnail(target.displayAvatarURL({ dynamic: true }))
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
