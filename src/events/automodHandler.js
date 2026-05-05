const spamMap = new Map();

async function handleAutomod(message, client) {
  if (!message.guild || message.author.bot) return;
  const a = client.db.getAutomod(message.guild.id);
  if (!a || !a.enabled) return;

  if (a.whitelist_channels && a.whitelist_channels.includes(message.channel.id)) return;
  if (a.whitelist_roles && message.member?.roles?.cache.some(r => a.whitelist_roles.includes(r.id))) return;
  if (message.member?.permissions.has(8n)) return;

  let shouldDelete = false;
  let reason = '';

  if (a.bad_words && a.bad_words_list.length) {
    const lower = message.content.toLowerCase();
    if (a.bad_words_list.some(w => lower.includes(w))) { shouldDelete = true; reason = 'Bad word'; }
  }

  if (!shouldDelete && a.links) {
    if (/https?:\/\/[^\s]+/i.test(message.content)) { shouldDelete = true; reason = 'Link'; }
  }

  if (!shouldDelete && a.invites) {
    if (/(discord\.(gg|io|me|li)|discordapp\.com\/invite)\//i.test(message.content)) { shouldDelete = true; reason = 'Discord invite'; }
  }

  if (!shouldDelete && a.caps) {
    const letters = message.content.replace(/[^a-zA-Z]/g, '');
    if (letters.length > 10 && (message.content.replace(/[^A-Z]/g, '').length / letters.length) > 0.7) { shouldDelete = true; reason = 'Excessive caps'; }
  }

  if (!shouldDelete && a.spam) {
    const key = `${message.guild.id}-${message.author.id}`;
    const now = Date.now();
    const timestamps = spamMap.get(key) || [];
    const recent = timestamps.filter(t => now - t < 5000);
    recent.push(now);
    spamMap.set(key, recent);
    if (recent.length >= 5) { shouldDelete = true; reason = 'Spam'; }
  }

  if (!shouldDelete) return;

  await message.delete().catch(() => {});

  const action = a.action || 'warn';
  const member = message.member;

  if (action === 'warn' || action === 'mute' || action === 'kick' || action === 'ban') {
    client.db.addWarning(message.guild.id, message.author.id, client.user.id, `Auto-Mod: ${reason}`);
  }
  if (action === 'mute' && member) await member.timeout(10 * 60000, `Auto-Mod: ${reason}`).catch(() => {});
  if (action === 'kick' && member) await member.kick(`Auto-Mod: ${reason}`).catch(() => {});
  if (action === 'ban') await message.guild.members.ban(message.author.id, { reason: `Auto-Mod: ${reason}` }).catch(() => {});

  const warn = await message.channel.send(`⚠️ ${message.author}, your message was removed: **${reason}**.`).catch(() => null);
  if (warn) setTimeout(() => warn.delete().catch(() => {}), 5000);

  if (a.log_channel) {
    const { EmbedBuilder } = require('discord.js');
    const lc = message.guild.channels.cache.get(a.log_channel);
    if (lc) await lc.send({ embeds: [new EmbedBuilder().setColor(0xe74c3c).setTitle('🤖 Auto-Mod Action').addFields(
      { name: 'User', value: `${message.author.tag} (${message.author.id})`, inline: true },
      { name: 'Channel', value: `${message.channel}`, inline: true },
      { name: 'Reason', value: reason, inline: true },
      { name: 'Action', value: action, inline: true },
      { name: 'Content', value: message.content.slice(0, 500) || '*none*' }
    ).setTimestamp()] }).catch(() => {});
  }
}

module.exports = { handleAutomod };
