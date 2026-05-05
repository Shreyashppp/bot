const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embeds');

const responses = [
  { text: 'It is certain.', type: 'positive' },
  { text: 'It is decidedly so.', type: 'positive' },
  { text: 'Without a doubt.', type: 'positive' },
  { text: 'Yes, definitely.', type: 'positive' },
  { text: 'You may rely on it.', type: 'positive' },
  { text: 'As I see it, yes.', type: 'positive' },
  { text: 'Most likely.', type: 'positive' },
  { text: 'Outlook good.', type: 'positive' },
  { text: 'Yes.', type: 'positive' },
  { text: 'Signs point to yes.', type: 'positive' },
  { text: 'Reply hazy, try again.', type: 'neutral' },
  { text: 'Ask again later.', type: 'neutral' },
  { text: 'Better not tell you now.', type: 'neutral' },
  { text: 'Cannot predict now.', type: 'neutral' },
  { text: 'Concentrate and ask again.', type: 'neutral' },
  { text: "Don't count on it.", type: 'negative' },
  { text: 'My reply is no.', type: 'negative' },
  { text: 'My sources say no.', type: 'negative' },
  { text: 'Outlook not so good.', type: 'negative' },
  { text: 'Very doubtful.', type: 'negative' },
];

const typeColors = { positive: COLORS.success, neutral: COLORS.warning, negative: COLORS.error };
const typeEmoji = { positive: '✅', neutral: '🔮', negative: '❌' };

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask the magic 8-ball a question')
    .addStringOption(opt => opt.setName('question').setDescription('Your question').setRequired(true)),

  async execute(interaction) {
    const question = interaction.options.getString('question');
    const response = responses[Math.floor(Math.random() * responses.length)];

    const embed = new EmbedBuilder()
      .setColor(typeColors[response.type])
      .setTitle('🎱 Magic 8-Ball')
      .addFields(
        { name: '❓ Question', value: question },
        { name: `${typeEmoji[response.type]} Answer`, value: response.text }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
