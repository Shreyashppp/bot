const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Display information about this server'),

  async execute(interaction, client) {
    const guild = interaction.guild;
    await guild.fetch();

    const owner = await guild.fetchOwner().catch(() => null);
    const textChannels = guild.channels.cache.filter(c => c.type === 0).size;
    const voiceChannels = guild.channels.cache.filter(c => c.type === 2).size;
    const roles = guild.roles.cache.size - 1;
    const boosts = guild.premiumSubscriptionCount;

    const embed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setTitle(`📊 ${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: '👑 Owner', value: owner ? owner.user.tag : 'Unknown', inline: true },
        { name: '🆔 Server ID', value: guild.id, inline: true },
        { name: '📅 Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
        { name: '👥 Members', value: `${guild.memberCount}`, inline: true },
        { name: '💬 Text Channels', value: `${textChannels}`, inline: true },
        { name: '🔊 Voice Channels', value: `${voiceChannels}`, inline: true },
        { name: '🎭 Roles', value: `${roles}`, inline: true },
        { name: '🚀 Boosts', value: `${boosts} (Level ${guild.premiumTier})`, inline: true },
        { name: '🔐 Verification', value: guild.verificationLevel.toString(), inline: true },
      )
      .setImage(guild.bannerURL({ size: 1024 }) || null)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
