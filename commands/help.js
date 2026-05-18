const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Shows the help menu'),
	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setColor(0x5865F2)
			.setTitle('📜 AetherBot Help')
			.setDescription('Basic commands:\n• /ping - Test the bot\nMore coming soon!')
			.setTimestamp();
		await interaction.reply({ embeds: [embed] });
	},
};