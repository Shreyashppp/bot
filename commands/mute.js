const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: "mute",

  async execute(interaction) {

    if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
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

    // 10 minutes mute
    await member.timeout(10 * 60 * 1000);

    const embed = new EmbedBuilder()
      .setTitle("🔇 User Muted")
      .setDescription(`${user.tag} muted for 10 minutes`)
      .setColor("Yellow");

    await interaction.reply({ embeds: [embed] });
  }
};
