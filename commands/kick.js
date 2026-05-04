const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: "kick",

  async execute(interaction) {

    // permission check
    if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return interaction.reply({
        content: "❌ You don't have permission",
        ephemeral: true
      });
    }

    const user = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return interaction.reply("❌ User not found");
    }

    // prevent kicking owner / higher role
    if (!member.kickable) {
      return interaction.reply("❌ I can't kick this user");
    }

    await member.kick();

    const embed = new EmbedBuilder()
      .setTitle("👢 User Kicked")
      .setDescription(`${user.tag} has been kicked`)
      .setColor("Orange");

    await interaction.reply({ embeds: [embed] });
  }
};
