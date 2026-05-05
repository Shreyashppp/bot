const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { errorEmbed, COLORS } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('testwelcome')
    .setDescription('Send a test welcome message')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction, client) {
    const settings = client.db.getGuild(interaction.guild.id);

    if (!settings.welcome_channel)
      return interaction.reply({ embeds: [errorEmbed('No welcome channel configured. Use `/setwelcome` first.')], ephemeral: true });

    const channel = interaction.guild.channels.cache.get(settings.welcome_channel);
    if (!channel)
      return interaction.reply({ embeds: [errorEmbed('The configured welcome channel no longer exists.')], ephemeral: true });

    const member = interaction.member;
    const message = (settings.welcome_message || 'Welcome {user} to **{server}**!')
      .replace('{user}', `<@${member.id}>`)
      .replace('{server}', interaction.guild.name)
      .replace('{username}', member.user.username)
      .replace('{membercount}', interaction.guild.memberCount);

    const embed = new EmbedBuilder()
      .setColor(COLORS.success)
      .setTitle('👋 Welcome! (Test)')
      .setDescription(message)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addFields({ name: 'Member #', value: `${interaction.guild.memberCount}`, inline: true })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
    await interaction.reply({ content: `✅ Test welcome message sent to ${channel}.`, ephemeral: true });
  },
};
