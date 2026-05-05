const { InteractionType } = require('discord.js');
const { errorEmbed } = require('../utils/embeds');
const logger = require('../utils/logger');

module.exports = {
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    if (!interaction.guild) {
      return interaction.reply({ embeds: [errorEmbed('This command can only be used in a server.')], ephemeral: true });
    }

    try {
      await command.execute(interaction, client);
    } catch (err) {
      logger.error(`Error executing /${interaction.commandName}:`, err);
      const msg = { embeds: [errorEmbed('Something went wrong while running that command.')], ephemeral: true };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(msg).catch(() => {});
      } else {
        await interaction.reply(msg).catch(() => {});
      }
    }
  },
};
