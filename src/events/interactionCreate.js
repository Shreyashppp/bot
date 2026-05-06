const { errorEmbed } = require('../utils/embeds');

const processed = new Set();

module.exports = {
  eventName: 'interactionCreate',
  async execute(interaction, client) {
    if (processed.has(interaction.id)) {
      console.warn(`[DUPLICATE] interactionCreate fired twice for ${interaction.id} — blocking second execution`);
      return;
    }
    processed.add(interaction.id);
    setTimeout(() => processed.delete(interaction.id), 5000);

    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      console.log(`[SLASH] ${interaction.user.tag} → /${interaction.commandName} in ${interaction.guild?.name}`);

      try {
        await command.execute(interaction, client);
      } catch (err) {
        console.error(`[SLASH ERROR] ${interaction.commandName}:`, err);
        const msg = { embeds: [errorEmbed('Something went wrong.')], flags: 64 };
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(msg).catch(() => {});
        } else {
          await interaction.reply(msg).catch(() => {});
        }
      }
      return;
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
