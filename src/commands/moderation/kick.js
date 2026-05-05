const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { modEmbed, errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  name: 'kick',
  aliases: ['k'],
  description: 'Kick a member from the server',
  usage: 'kick <user> [reason]',
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server')
    .addUserOption(o => o.setName('user').setDescription('User to kick').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction, client) {
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    if (!target) return interaction.reply({ embeds: [errorEmbed('User not in server.')], ephemeral: true });
    try {
      await target.kick(reason);
      client.db.addWarning(interaction.guild.id, target.id, interaction.user.id, `Kick: ${reason}`);
      const g = client.db.getGuild(interaction.guild.id);
      if (g.log_channel) {
        const lc = interaction.guild.channels.cache.get(g.log_channel);
        if (lc) await lc.send({ embeds: [modEmbed('Kick', target.user, interaction.user, reason)] }).catch(() => {});
      }
      await interaction.reply({ embeds: [successEmbed('Member Kicked', `**${target.user.tag}** has been kicked.\n**Reason:** ${reason}`)] });
    } catch {
      await interaction.reply({ embeds: [errorEmbed('Could not kick that user.')], ephemeral: true });
    }
  },

  async run(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) return message.reply('❌ Missing permissions.');
    const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!target) return message.reply('❌ Provide a valid member.');
    const reason = args.slice(1).join(' ') || 'No reason provided';
    try {
      await target.kick(reason);
      client.db.addWarning(message.guild.id, target.id, message.author.id, `Kick: ${reason}`);
      await message.reply({ embeds: [successEmbed('Member Kicked', `**${target.user.tag}** has been kicked.\n**Reason:** ${reason}`)] });
    } catch {
      await message.reply('❌ Could not kick that user.');
    }
  },
};
