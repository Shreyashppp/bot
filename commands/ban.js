const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: "ban",
  category: "moderation",

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers))
      return interaction.reply({ content: "No permission", ephemeral: true });

    const user = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) return interaction.reply("User not found");

    await member.ban();
    await interaction.reply(`Banned ${user.tag}`);
  }
};
