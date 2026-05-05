const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

async function getOwnedChannel(member, client) {
  const vc = member.voice.channel;
  if (!vc) return null;
  const jtc = client.db.getJTCChannel(vc.id);
  if (!jtc) return null;
  return jtc.owner_id === member.id ? vc : null;
}

module.exports = {
  name: 'voice',
  aliases: ['vc'],
  description: 'Manage your JTC voice channel',
  usage: 'voice <rename|lock|unlock|limit|kick|claim>',
  data: new SlashCommandBuilder()
    .setName('voice')
    .setDescription('Manage your JTC voice channel')
    .addSubcommand(s => s.setName('rename').setDescription('Rename your channel').addStringOption(o => o.setName('name').setDescription('New name').setRequired(true)))
    .addSubcommand(s => s.setName('lock').setDescription('Lock your channel'))
    .addSubcommand(s => s.setName('unlock').setDescription('Unlock your channel'))
    .addSubcommand(s => s.setName('limit').setDescription('Set user limit').addIntegerOption(o => o.setName('limit').setDescription('Limit (0 = unlimited)').setRequired(true).setMinValue(0).setMaxValue(99)))
    .addSubcommand(s => s.setName('kick').setDescription('Kick a user from your channel').addUserOption(o => o.setName('user').setDescription('User to kick').setRequired(true)))
    .addSubcommand(s => s.setName('claim').setDescription('Claim an ownerless channel')),

  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();
    const member = interaction.member;
    const vc = member.voice.channel;
    if (!vc) return interaction.reply({ embeds: [errorEmbed('You are not in a voice channel.')], ephemeral: true });

    if (sub === 'claim') {
      const jtc = client.db.getJTCChannel(vc.id);
      if (!jtc) return interaction.reply({ embeds: [errorEmbed('This is not a JTC channel.')], ephemeral: true });
      const owner = vc.members.get(jtc.owner_id);
      if (owner) return interaction.reply({ embeds: [errorEmbed('The owner is still in the channel.')], ephemeral: true });
      client.db.db.prepare('UPDATE jtc_channels SET owner_id = ? WHERE channel_id = ?').run(member.id, vc.id);
      return interaction.reply({ embeds: [successEmbed('Channel Claimed', `You now own **${vc.name}**.`)] });
    }

    const channel = await getOwnedChannel(member, client);
    if (!channel) return interaction.reply({ embeds: [errorEmbed('You do not own a JTC channel.')], ephemeral: true });

    if (sub === 'rename') {
      const name = interaction.options.getString('name');
      await channel.setName(name);
      return interaction.reply({ embeds: [successEmbed('Channel Renamed', `Channel renamed to **${name}**.`)] });
    }
    if (sub === 'lock') {
      await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { Connect: false });
      return interaction.reply({ embeds: [successEmbed('Channel Locked', '🔒 Your channel has been locked.')] });
    }
    if (sub === 'unlock') {
      await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { Connect: null });
      return interaction.reply({ embeds: [successEmbed('Channel Unlocked', '🔓 Your channel has been unlocked.')] });
    }
    if (sub === 'limit') {
      const limit = interaction.options.getInteger('limit');
      await channel.setUserLimit(limit);
      return interaction.reply({ embeds: [successEmbed('Limit Set', limit === 0 ? 'User limit removed.' : `Limit set to **${limit}**.`)] });
    }
    if (sub === 'kick') {
      const target = interaction.options.getMember('user');
      if (!target?.voice?.channelId || target.voice.channelId !== channel.id) return interaction.reply({ embeds: [errorEmbed('That user is not in your channel.')], ephemeral: true });
      await target.voice.disconnect();
      return interaction.reply({ embeds: [successEmbed('User Kicked', `**${target.user.tag}** was kicked from your channel.`)] });
    }
  },

  async run(message, args, client) {
    const sub = args[0]?.toLowerCase();
    const member = message.member;
    const vc = member.voice?.channel;
    if (!vc) return message.reply('❌ You are not in a voice channel.');
    const channel = await getOwnedChannel(member, client);
    if (!channel && sub !== 'claim') return message.reply('❌ You do not own a JTC channel.');
    if (sub === 'rename' && args[1]) { await channel.setName(args.slice(1).join(' ')); return message.reply({ embeds: [successEmbed('Renamed', `Channel renamed.`)] }); }
    if (sub === 'lock') { await channel.permissionOverwrites.edit(message.guild.roles.everyone, { Connect: false }); return message.reply({ embeds: [successEmbed('Locked', '🔒 Channel locked.')] }); }
    if (sub === 'unlock') { await channel.permissionOverwrites.edit(message.guild.roles.everyone, { Connect: null }); return message.reply({ embeds: [successEmbed('Unlocked', '🔓 Channel unlocked.')] }); }
    if (sub === 'limit') { await channel.setUserLimit(parseInt(args[1]) || 0); return message.reply({ embeds: [successEmbed('Limit Set', `Limit updated.`)] }); }
    return message.reply('Usage: `.voice <rename|lock|unlock|limit|kick|claim>`');
  },
};
