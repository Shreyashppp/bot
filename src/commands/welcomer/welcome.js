const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { successEmbed, errorEmbed, COLORS } = require('../../utils/embeds');

module.exports = {
  name: 'welcome',
  aliases: ['welcomer'],
  description: 'Configure welcome messages',
  usage: 'welcome <setchannel|setmessage|enable|disable|test>',
  data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Configure welcome messages')
    .addSubcommand(s => s.setName('setchannel').setDescription('Set welcome channel').addChannelOption(o => o.setName('channel').setDescription('Channel').setRequired(true)))
    .addSubcommand(s => s.setName('setmessage').setDescription('Set welcome message').addStringOption(o => o.setName('message').setDescription('Use {user}, {username}, {server}, {membercount}').setRequired(true)))
    .addSubcommand(s => s.setName('enable').setDescription('Enable welcome messages'))
    .addSubcommand(s => s.setName('disable').setDescription('Disable welcome messages'))
    .addSubcommand(s => s.setName('test').setDescription('Preview welcome message'))
    .addSubcommand(s => s.setName('status').setDescription('View current welcome settings'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    if (sub === 'setchannel') {
      const channel = interaction.options.getChannel('channel');
      client.db.setWelcomer(guildId, 'welcome_channel', channel.id);
      return interaction.reply({ embeds: [successEmbed('Welcome Channel Set', `Welcome messages will be sent to ${channel}.`)] });
    }
    if (sub === 'setmessage') {
      const msg = interaction.options.getString('message');
      client.db.setWelcomer(guildId, 'welcome_message', msg);
      return interaction.reply({ embeds: [successEmbed('Welcome Message Set', `Message updated.\n**Preview:** ${msg.replace(/{user}/g, interaction.user.toString()).replace(/{username}/g, interaction.user.username).replace(/{server}/g, interaction.guild.name).replace(/{membercount}/g, interaction.guild.memberCount)}`)] });
    }
    if (sub === 'enable') { client.db.setWelcomer(guildId, 'welcome_enabled', 1); return interaction.reply({ embeds: [successEmbed('Welcome Enabled', '✅ Welcome messages are now enabled.')] }); }
    if (sub === 'disable') { client.db.setWelcomer(guildId, 'welcome_enabled', 0); return interaction.reply({ embeds: [successEmbed('Welcome Disabled', '❌ Welcome messages are now disabled.')] }); }
    if (sub === 'test') {
      const w = client.db.getWelcomer(guildId);
      if (!w.welcome_channel) return interaction.reply({ embeds: [errorEmbed('No welcome channel set.')], ephemeral: true });
      const channel = interaction.guild.channels.cache.get(w.welcome_channel);
      if (!channel) return interaction.reply({ embeds: [errorEmbed('Welcome channel not found.')], ephemeral: true });
      const msg = (w.welcome_message || 'Welcome {user}!').replace(/{user}/g, `${interaction.user}`).replace(/{username}/g, interaction.user.username).replace(/{server}/g, interaction.guild.name).replace(/{membercount}/g, interaction.guild.memberCount);
      await channel.send({ embeds: [new EmbedBuilder().setColor(0xe74c3c).setDescription(msg).setThumbnail(interaction.user.displayAvatarURL({ dynamic: true })).setFooter({ text: `Member #${interaction.guild.memberCount}` }).setTimestamp()] });
      return interaction.reply({ embeds: [successEmbed('Test Sent', `Preview sent to ${channel}.`)], ephemeral: true });
    }
    if (sub === 'status') {
      const w = client.db.getWelcomer(guildId);
      return interaction.reply({ embeds: [new EmbedBuilder().setColor(COLORS.primary).setTitle('👋 Welcomer Settings').addFields(
        { name: 'Status', value: w.welcome_enabled ? '✅ Enabled' : '❌ Disabled', inline: true },
        { name: 'Channel', value: w.welcome_channel ? `<#${w.welcome_channel}>` : 'Not set', inline: true },
        { name: 'Message', value: w.welcome_message || 'Default' }
      )] });
    }
  },

  async run(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) return message.reply('❌ Missing permissions.');
    const sub = args[0]?.toLowerCase();
    const guildId = message.guild.id;
    if (sub === 'setchannel') {
      const channel = message.mentions.channels.first();
      if (!channel) return message.reply('❌ Mention a channel.');
      client.db.setWelcomer(guildId, 'welcome_channel', channel.id);
      return message.reply({ embeds: [successEmbed('Welcome Channel Set', `Set to ${channel}.`)] });
    }
    if (sub === 'setmessage') {
      const msg = args.slice(1).join(' ');
      if (!msg) return message.reply('❌ Provide a message.');
      client.db.setWelcomer(guildId, 'welcome_message', msg);
      return message.reply({ embeds: [successEmbed('Welcome Message Set', 'Updated.')] });
    }
    if (sub === 'enable') { client.db.setWelcomer(guildId, 'welcome_enabled', 1); return message.reply({ embeds: [successEmbed('Welcome Enabled', 'Enabled.')] }); }
    if (sub === 'disable') { client.db.setWelcomer(guildId, 'welcome_enabled', 0); return message.reply({ embeds: [successEmbed('Welcome Disabled', 'Disabled.')] }); }
    const w = client.db.getWelcomer(guildId);
    return message.reply({ embeds: [new EmbedBuilder().setColor(COLORS.primary).setTitle('👋 Welcome').setDescription(`**Status:** ${w.welcome_enabled ? '✅' : '❌'}\n**Channel:** ${w.welcome_channel ? `<#${w.welcome_channel}>` : 'Not set'}\n**Message:** ${w.welcome_message || 'Default'}`)] });
  },
};
