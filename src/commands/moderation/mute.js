const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { modEmbed, errorEmbed, successEmbed } = require('../../utils/embeds');

function parseDuration(str) {
  const match = str?.match(/^(\d+)(s|m|h|d)$/i);
  if (!match) return 10 * 60 * 1000;
  const val = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  return val * { s: 1000, m: 60000, h: 3600000, d: 86400000 }[unit];
}

module.exports = {
  name: 'mute',
  aliases: ['timeout', 'tm'],
  description: 'Timeout a member',
  usage: 'mute <user> [duration: 10m] [reason]',
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Timeout a member')
    .addUserOption(o => o.setName('user').setDescription('User to mute').setRequired(true))
    .addStringOption(o => o.setName('duration').setDescription('Duration (e.g. 10m, 1h, 1d)'))
    .addStringOption(o => o.setName('reason').setDescription('Reason'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction, client) {
    const target = interaction.options.getMember('user');
    const dur = parseDuration(interaction.options.getString('duration') || '10m');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    if (!target) return interaction.reply({ embeds: [errorEmbed('User not in server.')], ephemeral: true });
    try {
      await target.timeout(dur, reason);
      client.db.addWarning(interaction.guild.id, target.id, interaction.user.id, `Mute: ${reason}`);
      const g = client.db.getGuild(interaction.guild.id);
      if (g.log_channel) {
        const lc = interaction.guild.channels.cache.get(g.log_channel);
        if (lc) await lc.send({ embeds: [modEmbed('Mute', target.user, interaction.user, reason)] }).catch(() => {});
      }
      await interaction.reply({ embeds: [successEmbed('Member Muted', `**${target.user.tag}** has been muted for ${Math.round(dur / 60000)} min.\n**Reason:** ${reason}`)] });
    } catch {
      await interaction.reply({ embeds: [errorEmbed('Could not mute that user.')], ephemeral: true });
    }
  },

  async run(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return message.reply('❌ Missing permissions.');
    const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!target) return message.reply('❌ Provide a valid member.');
    const dur = parseDuration(args[1]) || 600000;
    const reason = args.slice(2).join(' ') || 'No reason provided';
    try {
      await target.timeout(dur, reason);
      client.db.addWarning(message.guild.id, target.id, message.author.id, `Mute: ${reason}`);
      await message.reply({ embeds: [successEmbed('Member Muted', `**${target.user.tag}** muted for ${Math.round(dur / 60000)} min.\n**Reason:** ${reason}`)] });
    } catch {
      await message.reply('❌ Could not mute that user.');
    }
  },
};
