const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  name: 'unmute',
  aliases: ['untimeout'],
  description: 'Remove timeout from a member',
  usage: 'unmute <user>',
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Remove timeout from a member')
    .addUserOption(o => o.setName('user').setDescription('User to unmute').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction, client) {
    const target = interaction.options.getMember('user');
    if (!target) return interaction.reply({ embeds: [errorEmbed('User not in server.')], ephemeral: true });
    try {
      await target.timeout(null);
      await interaction.reply({ embeds: [successEmbed('Member Unmuted', `**${target.user.tag}** has been unmuted.`)] });
    } catch {
      await interaction.reply({ embeds: [errorEmbed('Could not unmute that user.')], ephemeral: true });
    }
  },

  async run(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return message.reply('❌ Missing permissions.');
    const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!target) return message.reply('❌ Provide a valid member.');
    try {
      await target.timeout(null);
      await message.reply({ embeds: [successEmbed('Member Unmuted', `**${target.user.tag}** has been unmuted.`)] });
    } catch {
      await message.reply('❌ Could not unmute that user.');
    }
  },
};
