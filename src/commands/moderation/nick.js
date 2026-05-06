const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  name: 'nick',
  aliases: ['nickname', 'setnick'],
  description: 'Change a member\'s nickname',
  usage: 'nick <user> [nickname]',
  data: new SlashCommandBuilder()
    .setName('nick')
    .setDescription('Change a member\'s nickname')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addStringOption(o => o.setName('nickname').setDescription('New nickname (leave empty to reset)'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),

  async execute(interaction, client) {
    const target = interaction.options.getMember('user');
    const nick = interaction.options.getString('nickname') || null;
    if (!target) return interaction.reply({ embeds: [errorEmbed('User not in server.')], flags: 64 });
    try {
      await target.setNickname(nick);
      await interaction.reply({ embeds: [successEmbed('Nickname Changed', nick ? `Set **${target.user.tag}**'s nickname to **${nick}**.` : `Reset **${target.user.tag}**'s nickname.`)] });
    } catch {
      await interaction.reply({ embeds: [errorEmbed('Could not change nickname.')], flags: 64 });
    }
  },

  async run(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageNicknames)) return message.reply('❌ Missing permissions.');
    const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!target) return message.reply('❌ Provide a valid member.');
    const nick = args.slice(1).join(' ') || null;
    try {
      await target.setNickname(nick);
      await message.reply({ embeds: [successEmbed('Nickname Changed', nick ? `Set nickname to **${nick}**.` : `Reset nickname.`)] });
    } catch {
      await message.reply('❌ Could not change nickname.');
    }
  },
};
