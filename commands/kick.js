const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: "kick",
  category: "moderation",

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers))
      return interaction.reply({ content: "No permission", ephemeral: true });

    const user = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) return interaction.reply("User not found");

    await member.kick();
    await interaction.reply(`Kicked ${user.tag}`);
  }
};
