const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show bot commands'),
  
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('📜 AetherBot Help')
      .setDescription('**Core Commands:**
• `/ping` - Check latency
• `/help` - This menu

More commands are loaded from the full system.')
      .setFooter({ text: 'AetherBot • Professional Discord Bot' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};