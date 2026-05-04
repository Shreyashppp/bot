const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: "mute",
  category: "moderation",

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers))
      return interaction.reply({ content: "No permission", ephemeral: true });

    const user = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) return interaction.reply("User not found");

    await member.timeout(10 * 60 * 1000);
    await interaction.reply(`Muted ${user.tag}`);
  }
};
