const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { errorEmbed, successEmbed, warnEmbed } = require('../../utils/embeds');

module.exports = {
  name: 'warn',
  aliases: ['w'],
  description: 'Warn a member',
  usage: 'warn <user> [reason]',
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member')
    .addUserOption(o => o.setName('user').setDescription('User to warn').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction, client) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const count = client.db.addWarning(interaction.guild.id, target.id, interaction.user.id, reason);
    const sm = client.db.getSmartmod(interaction.guild.id);
    let extra = '';
    if (sm.enabled) {
      if (count >= sm.ban_at) {
        await interaction.guild.members.ban(target.id, { reason: 'Smart Mod: Warn limit reached' }).catch(() => {});
        extra = '\n🔨 **Smart Mod:** User has been **banned** (warn limit reached).';
      } else if (count >= sm.kick_at) {
        const m = interaction.guild.members.cache.get(target.id);
        if (m) await m.kick('Smart Mod: Warn limit reached').catch(() => {});
        extra = '\n👢 **Smart Mod:** User has been **kicked** (warn limit reached).';
      } else if (count >= sm.mute_at) {
        const m = interaction.guild.members.cache.get(target.id);
        if (m) await m.timeout(sm.mute_duration * 1000, 'Smart Mod: Warn limit reached').catch(() => {});
        extra = '\n🔇 **Smart Mod:** User has been **muted** (warn limit reached).';
      }
    }
    await interaction.reply({ embeds: [warnEmbed('Member Warned', `**${target.tag}** has been warned. They now have **${count}** warning(s).\n**Reason:** ${reason}${extra}`)] });
  },

  async run(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return message.reply('❌ Missing permissions.');
    const target = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
    if (!target) return message.reply('❌ Provide a valid user.');
    const reason = args.slice(1).join(' ') || 'No reason provided';
    const count = client.db.addWarning(message.guild.id, target.id, message.author.id, reason);
    await message.reply({ embeds: [warnEmbed('Member Warned', `**${target.tag}** warned. They now have **${count}** warning(s).\n**Reason:** ${reason}`)] });
  },
};
