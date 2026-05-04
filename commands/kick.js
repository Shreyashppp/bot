const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} = require('discord.js');

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
    .setName('kick')
    .setDescription('Kick a member from the server with an optional moderation reason.')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDMPermission(false)
    .addUserOption(option =>
      option.setName('user').setDescription('User to kick').setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('reason')
        .setDescription('Reason for the kick')
        .setMaxLength(512)
        .setRequired(false)
    ),
  category: 'moderation',

  async execute(interaction) {
    const targetUser = interaction.options.getUser('user', true);
    const targetMember = await resolveMember(interaction, targetUser.id);
    const invokerMember = await resolveInvokerMember(interaction);
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
        content: 'You cannot kick yourself.',
        ephemeral: true
      });
      return;
    }

    if (targetMember.id === interaction.client.user.id) {
      await interaction.reply({
        content: 'I cannot kick myself.',
        ephemeral: true
      });
      return;
    }

    if (targetMember.id === interaction.guild.ownerId) {
      await interaction.reply({
        content: 'The server owner cannot be kicked.',
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
        content: 'You can only kick members below your highest role.',
        ephemeral: true
      });
      return;
    }

    if (!targetMember.kickable) {
      await interaction.reply({
        content: 'I cannot kick this member due to role hierarchy or missing permissions.',
        ephemeral: true
      });
      return;
    }

    await targetMember.kick(`${reason} | Moderator: ${interaction.user.tag}`);

    const embed = new EmbedBuilder()
      .setColor(0xfee75c)
      .setTitle('👢 Member Kicked')
      .addFields(
        { name: 'Member', value: `${targetUser.tag} (\`${targetUser.id}\`)` },
        { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
        { name: 'Reason', value: reason }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
