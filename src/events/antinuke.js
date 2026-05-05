async function handleNuke(guild, executor, actionType, client) {
  if (!executor || executor.bot) return;
  const an = client.db.getAntinuke(guild.id);
  if (!an || !an.enabled || !an[actionType]) return;
  if (executor.id === guild.ownerId) return;
  if (client.db.isAntinukeWhitelisted(guild.id, executor.id)) return;

  client.db.trackAntinukeAction(guild.id, executor.id, actionType);
  const count = client.db.getRecentAntinukeActions(guild.id, executor.id, actionType, 10000);
  if (count < an.threshold) return;

  const member = guild.members.cache.get(executor.id);
  if (!member) return;

  try {
    if (an.action === 'ban') await guild.members.ban(executor.id, { reason: `Anti-Nuke: ${actionType}` });
    else if (an.action === 'kick') await member.kick(`Anti-Nuke: ${actionType}`);
    else await member.timeout(24 * 3600000, `Anti-Nuke: ${actionType}`);
  } catch {}

  if (an.log_channel) {
    const { EmbedBuilder } = require('discord.js');
    const lc = guild.channels.cache.get(an.log_channel);
    if (lc) {
      await lc.send({ embeds: [new EmbedBuilder().setColor(0xe74c3c)
        .setTitle('🛡️ Anti-Nuke Triggered')
        .setDescription(`**User:** ${executor.tag} (${executor.id})\n**Action:** ${actionType}\n**Count:** ${count} in 10s\n**Punishment:** ${an.action}`)] }).catch(() => {});
    }
  }
}

module.exports = { handleNuke };
