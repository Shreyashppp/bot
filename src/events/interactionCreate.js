const { errorEmbed } = require('../utils/embeds');

module.exports = {
  eventName: 'interactionCreate',
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction, client);
      } catch (err) {
        console.error(err);
        const msg = { embeds: [errorEmbed('Something went wrong.')], flags: 64 };
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(msg).catch(() => {});
        } else {
          await interaction.reply(msg).catch(() => {});
        }
      }
    }

    if (interaction.isButton()) {
      if (interaction.customId.startsWith('selfrole_')) {
        const roleId = interaction.customId.replace('selfrole_', '');
        const member = interaction.member;
        try {
          if (member.roles.cache.has(roleId)) {
            await member.roles.remove(roleId);
            await interaction.reply({ content: `✅ Removed <@&${roleId}>`, flags: 64 });
          } else {
            await member.roles.add(roleId);
            await interaction.reply({ content: `✅ Added <@&${roleId}>`, flags: 64 });
          }
        } catch {
          await interaction.reply({ content: '❌ Could not manage that role.', flags: 64 });
        }
      }
    }
  },
};
