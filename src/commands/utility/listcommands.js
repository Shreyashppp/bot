const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('listcommands')
    .setDescription('List all custom commands for this server'),

  async execute(interaction, client) {
    const cmds = client.db.listCustomCommands(interaction.guild.id);

    if (!cmds.length) {
      return interaction.reply({
        embeds: [new EmbedBuilder().setColor(COLORS.warning).setDescription('No custom commands set up yet. Use `/addcommand` to create one.')],
        ephemeral: true,
      });
    }

    const list = cmds.map(c => `**/${c.name}** — ${c.response.slice(0, 60)}${c.response.length > 60 ? '...' : ''}`).join('\n');

    const embed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setTitle('📋 Custom Commands')
      .setDescription(list)
      .setFooter({ text: `${cmds.length} custom command(s)` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
