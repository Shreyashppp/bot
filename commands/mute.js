const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} = require('discord.js');

const MINUTES_TO_MS = 60 * 1000;

async function resolveMember(interaction, userId) {
  const cachedMember = interaction.options.getMember('user');
  if (cachedMember) {
    return cachedMember;
  }

  return interaction.guild.members.fetch(userId).catch(() => null);
}

async function resolveInvokerMember(interaction) {
  if (interaction.member?.roles?.highest) {
    return interaction.member;
  }

  return interaction.guild.members.fetch(interaction.user.id).catch(() => null);
}

function hasRoleHierarchyAccess(invokerMember, targetMember, guildOwnerId, invokerId) {
  if (guildOwnerId === invokerId) {
    return true;
  }
  return invokerMember.roles.highest.position > targetMember.roles.highest.position;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Temporarily timeout a member for a chosen number of minutes.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addUserOption(option =>
      option.setName('user').setDescription('User to timeout').setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('duration')
        .setDescription('Timeout duration in minutes')
        .setMinValue(1)
        .setMaxValue(10080)
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('reason')
        .setDescription('Reason for the timeout')
        .setMaxLength(512)
        .setRequired(false)
    ),
  category: 'moderation',

  async execute(interaction) {
    const targetUser = interaction.options.getUser('user', true);
    const targetMember = await resolveMember(interaction, targetUser.id);
    const invokerMember = await resolveInvokerMember(interaction);
    const durationMinutes = interaction.options.getInteger('duration') || 10;
    const reason = interaction.options.getString('reason') || 'No reason provided.';

    if (!invokerMember) {
      await interaction.reply({
        content: 'I could not verify your server member profile. Please try again.',
        ephemeral: true
      });
      return;
    }

    if (!targetMember) {
      await interaction.reply({
        content: 'I could not find that member in this server.',
        ephemeral: true
      });
      return;
    }

    if (targetMember.id === interaction.user.id) {
      await interaction.reply({
        content: 'You cannot timeout yourself.',
        ephemeral: true
      });
      return;
    }

    if (targetMember.id === interaction.client.user.id) {
      await interaction.reply({
        content: 'I cannot timeout myself.',
        ephemeral: true
      });
      return;
    }

    if (
      !hasRoleHierarchyAccess(
        invokerMember,
        targetMember,
        interaction.guild.ownerId,
        interaction.user.id
      )
    ) {
      await interaction.reply({
        content: 'You can only timeout members below your highest role.',
        ephemeral: true
      });
      return;
    }

    if (!targetMember.moderatable) {
      await interaction.reply({
        content: 'I cannot timeout this member due to role hierarchy or missing permissions.',
        ephemeral: true
      });
      return;
    }

    const timeoutMs = durationMinutes * MINUTES_TO_MS;
    const timeoutUntil = Math.floor((Date.now() + timeoutMs) / 1000);

    await targetMember.timeout(timeoutMs, `${reason} | Moderator: ${interaction.user.tag}`);

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('🔇 Member Timed Out')
      .addFields(
        { name: 'Member', value: `${targetUser.tag} (\`${targetUser.id}\`)` },
        { name: 'Duration', value: `${durationMinutes} minute(s)`, inline: true },
        { name: 'Ends', value: `<t:${timeoutUntil}:R>`, inline: true },
        { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
        { name: 'Reason', value: reason }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
