const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: "ban",

  async execute(interaction) {

    // Check permission
    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({
        content: "❌ You don't have permission to use this command",
        ephemeral: true
      });
    }

    // Get user
    const user = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return interaction.reply("❌ User not found");
    }

    // Ban user
    await member.ban();

    // Embed response
    const embed = new EmbedBuilder()
      .setTitle("🔨 User Banned")
      .setDescription(`${user.tag} has been banned`)
      .setColor("Red");

    await interaction.reply({ embeds: [embed] });
  }
};
