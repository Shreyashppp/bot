const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { errorEmbed, COLORS } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('View warnings for a member')
    .addUserOption(opt => opt.setName('user').setDescription('User to check').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction, client) {
    const target = interaction.options.getUser('user');
    const warnings = client.db.getWarnings(interaction.guild.id, target.id);

    if (warnings.length === 0) {
      return interaction.reply({ embeds: [new EmbedBuilder().setColor(COLORS.success).setDescription(`✅ ${target.tag} has no warnings.`)] });
    }

    const list = warnings.slice(0, 10).map((w, i) => {
      const ts = `<t:${Math.floor(w.timestamp / 1000)}:R>`;
      return `**${i + 1}.** ${w.reason} — by <@${w.moderator_id}> ${ts}`;
    }).join('\n');

    const embed = new EmbedBuilder()
      .setColor(COLORS.warning)
      .setTitle(`⚠️ Warnings for ${target.tag}`)
      .setDescription(list)
      .setFooter({ text: `Total: ${warnings.length} warning(s)` })
      .setThumbnail(target.displayAvatarURL({ dynamic: true }))
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
