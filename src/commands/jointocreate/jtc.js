const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder } = require('discord.js');
const { successEmbed, errorEmbed, COLORS } = require('../../utils/embeds');

module.exports = {
  name: 'jtc',
  aliases: ['jointocreate', 'j2c'],
  description: 'Manage Join to Create voice channels',
  usage: 'jtc <setup|remove|status>',
  data: new SlashCommandBuilder()
    .setName('jtc')
    .setDescription('Manage Join to Create')
    .addSubcommand(s => s.setName('setup')
      .setDescription('Set up a JTC hub channel')
      .addChannelOption(o => o.setName('channel').setDescription('The hub voice channel').setRequired(true))
      .addStringOption(o => o.setName('template').setDescription('Channel name template ({user}, {username})')))
    .addSubcommand(s => s.setName('remove').setDescription('Remove JTC setup'))
    .addSubcommand(s => s.setName('status').setDescription('View JTC settings'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    if (sub === 'setup') {
      const channel = interaction.options.getChannel('channel');
      const template = interaction.options.getString('template') || "{user}'s Channel";
      if (channel.type !== ChannelType.GuildVoice) return interaction.reply({ embeds: [errorEmbed('Please select a voice channel.')], flags: 64 });
      client.db.setJTC(guildId, channel.id, channel.parentId, template);
      return interaction.reply({ embeds: [successEmbed('JTC Setup', `✅ Join **${channel.name}** to create a temporary voice channel.\n**Template:** \`${template}\``)] });
    }

    if (sub === 'remove') {
      client.db.removeJTC(guildId);
      return interaction.reply({ embeds: [successEmbed('JTC Removed', 'Join to Create has been disabled.')] });
    }

    if (sub === 'status') {
      const jtc = client.db.getJTC(guildId);
      if (!jtc) return interaction.reply({ embeds: [errorEmbed('JTC is not set up.')], flags: 64 });
      return interaction.reply({ embeds: [new EmbedBuilder().setColor(COLORS.primary).setTitle('🔊 Join to Create').addFields(
        { name: 'Hub Channel', value: `<#${jtc.hub_channel_id}>`, inline: true },
        { name: 'Name Template', value: jtc.name_template, inline: true }
      )] });
    }
  },

  async run(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) return message.reply('❌ Missing permissions.');
    const sub = args[0]?.toLowerCase();
    const guildId = message.guild.id;
    if (sub === 'remove') { client.db.removeJTC(guildId); return message.reply({ embeds: [successEmbed('JTC Removed', 'Disabled.')] }); }
    const jtc = client.db.getJTC(guildId);
    if (!jtc) return message.reply('❌ JTC is not set up. Use `.jtc setup` or `/jtc setup`.');
    return message.reply({ embeds: [new EmbedBuilder().setColor(COLORS.primary).setTitle('🔊 JTC').setDescription(`**Hub:** <#${jtc.hub_channel_id}>\n**Template:** ${jtc.name_template}`)] });
  },
};
