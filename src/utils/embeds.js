const { EmbedBuilder } = require('discord.js');

const COLORS = {
  primary: 0xe74c3c,
  success: 0x2ecc71,
  error: 0xe74c3c,
  warning: 0xf39c12,
  info: 0x3498db,
  dark: 0x2c2f33,
};

function successEmbed(title, description) {
  return new EmbedBuilder().setColor(COLORS.success).setTitle(`✅ ${title}`).setDescription(description).setTimestamp();
}

function errorEmbed(description) {
  return new EmbedBuilder().setColor(COLORS.error).setTitle('❌ Error').setDescription(description).setTimestamp();
}

function infoEmbed(title, description) {
  return new EmbedBuilder().setColor(COLORS.primary).setTitle(title).setDescription(description).setTimestamp();
}

function warnEmbed(title, description) {
  return new EmbedBuilder().setColor(COLORS.warning).setTitle(`⚠️ ${title}`).setDescription(description).setTimestamp();
}

function modEmbed(action, target, moderator, reason, extra = {}) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.primary)
    .setTitle(`🔨 ${action}`)
    .addFields(
      { name: 'User', value: `${target}`, inline: true },
      { name: 'Moderator', value: `${moderator}`, inline: true },
      { name: 'Reason', value: reason || 'No reason provided', inline: false }
    )
    .setTimestamp();
  for (const [k, v] of Object.entries(extra)) {
    embed.addFields({ name: k, value: String(v), inline: true });
  }
  return embed;
}

module.exports = { COLORS, successEmbed, errorEmbed, infoEmbed, warnEmbed, modEmbed };
