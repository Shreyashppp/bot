const { errorEmbed } = require('../utils/embeds');

const handled = new Set();

module.exports = {
  eventName: 'interactionCreate',

  async execute(interaction, client) {
    // Skip interactions that arrived before this instance was ready
    const cutoff = (client.readyTimestamp || client.bootTime || 0) - 500;
    if (interaction.createdTimestamp < cutoff) {
      console.log(`[SKIP-OLD] interaction ${interaction.id} is from before bot ready — ignoring`);
      return;
    }

    // In-process dedup guard
    if (handled.has(interaction.id)) {
      console.warn(`[DUPLICATE] interactionCreate fired twice for ${interaction.id} — blocked`);
      return;
    }
    handled.add(interaction.id);
    setTimeout(() => handled.delete(interaction.id), 10000);

    // --- Slash commands ---
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      if (interaction.replied || interaction.deferred) {
        console.warn(`[SKIP] /${interaction.commandName} already replied/deferred`);
        return;
      }

      console.log(`[SLASH] ${interaction.user.tag} → /${interaction.commandName} in ${interaction.guild?.name}`);

      try {
        await command.execute(interaction, client);
      } catch (err) {
        console.error(`[SLASH ERROR] ${interaction.commandName}:`, err.message);
        const payload = { embeds: [errorEmbed('Something went wrong.')], flags: 64 };
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(payload).catch(() => {});
        } else {
          await interaction.reply(payload).catch(() => {});
        }
      }
      return;
    }

    // --- Button interactions ---
    if (interaction.isButton()) {
      if (interaction.replied || interaction.deferred) return;

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
          await interaction.reply({ content: '❌ Could not manage that role.', flags: 64 }).catch(() => {});
        }
      }
      return;
    }

    // --- Select menu / other components handled by collectors ---
    // (help menu dropdowns etc. are handled by their own collectors — do NOT reply here)
  },
};
