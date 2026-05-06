const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { modEmbed, errorEmbed, successEmbed } = require('../../utils/embeds');

async function banUser(guild, target, moderator, reason, db, soft = false) {
  await guild.members.ban(target.id, { reason, deleteMessageSeconds: soft ? 604800 : 0 });
  if (soft) await guild.members.unban(target.id, 'Softban');
  db.addWarning(guild.id, target.id, moderator.id, `${soft ? 'Softban' : 'Ban'}: ${reason}`);
  const logGuild = db.getGuild(guild.id);
  if (logGuild.log_channel) {
    const logChannel = guild.channels.cache.get(logGuild.log_channel);
    if (logChannel) await logChannel.send({ embeds: [modEmbed(soft ? 'Softban' : 'Ban', target, moderator, reason)] }).catch(() => {});
  }
}

module.exports = {
  name: 'ban',
  aliases: ['b'],
  description: 'Ban a member from the server',
  usage: 'ban <user> [reason]',
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server')
    .addUserOption(o => o.setName('user').setDescription('User to ban').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason for ban'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction, client) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    if (target.id === interaction.user.id) return interaction.reply({ embeds: [errorEmbed('You cannot ban yourself.')], flags: 64 });
    try {
      await banUser(interaction.guild, target, interaction.user, reason, client.db);
      await interaction.reply({ embeds: [successEmbed('Member Banned', `**${target.tag}** has been banned.\n**Reason:** ${reason}`)] });
    } catch {
      await interaction.reply({ embeds: [errorEmbed('Could not ban that user.')], flags: 64 });
    }
  },

  async run(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) return message.reply('❌ Missing permissions.');
    const target = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
    if (!target) return message.reply('❌ Provide a valid user.');
    const reason = args.slice(1).join(' ') || 'No reason provided';
    try {
      await banUser(message.guild, target, message.author, reason, client.db);
      await message.reply({ embeds: [successEmbed('Member Banned', `**${target.tag}** has been banned.\n**Reason:** ${reason}`)] });
    } catch {
      await message.reply('❌ Could not ban that user.');
    }
  },
};
