const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { COLORS } = require('../../utils/embeds');
const https = require('https');

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { Accept: 'application/json' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

function decode(str) {
  return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'");
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trivia')
    .setDescription('Answer a random trivia question'),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const data = await fetchJSON('https://opentdb.com/api.php?amount=1&type=multiple');
      const q = data.results[0];
      const question = decode(q.question);
      const correct = decode(q.correct_answer);
      const incorrect = q.incorrect_answers.map(decode);

      const allAnswers = [...incorrect, correct].sort(() => Math.random() - 0.5);
      const correctIndex = allAnswers.indexOf(correct);

      const buttons = allAnswers.map((ans, i) => ({
        label: ans.slice(0, 80),
        value: i,
        correct: i === correctIndex,
      }));

      const row = new ActionRowBuilder().addComponents(
        buttons.map((b, i) =>
          new ButtonBuilder()
            .setCustomId(`trivia_${i}`)
            .setLabel(b.label)
            .setStyle(ButtonStyle.Secondary)
        )
      );

      const embed = new EmbedBuilder()
        .setColor(COLORS.primary)
        .setTitle('🧠 Trivia')
        .addFields(
          { name: 'Category', value: decode(q.category), inline: true },
          { name: 'Difficulty', value: q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1), inline: true },
          { name: 'Question', value: question }
        )
        .setFooter({ text: 'You have 20 seconds to answer!' })
        .setTimestamp();

      const msg = await interaction.editReply({ embeds: [embed], components: [row] });

      const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 20000 });

      collector.on('collect', async (btn) => {
        if (btn.user.id !== interaction.user.id) {
          return btn.reply({ content: 'This is not your trivia question!', ephemeral: true });
        }

        const chosen = parseInt(btn.customId.split('_')[1]);
        const isCorrect = chosen === correctIndex;

        const resultEmbed = new EmbedBuilder()
          .setColor(isCorrect ? COLORS.success : COLORS.error)
          .setTitle(isCorrect ? '✅ Correct!' : '❌ Wrong!')
          .setDescription(`The correct answer was: **${correct}**`)
          .addFields({ name: 'Question', value: question });

        collector.stop();
        await btn.update({ embeds: [resultEmbed], components: [] });
      });

      collector.on('end', async (_, reason) => {
        if (reason === 'time') {
          const timeoutEmbed = new EmbedBuilder()
            .setColor(COLORS.warning)
            .setTitle('⏰ Time\'s Up!')
            .setDescription(`The correct answer was: **${correct}**`);
          await interaction.editReply({ embeds: [timeoutEmbed], components: [] }).catch(() => {});
        }
      });
    } catch {
      await interaction.editReply({ content: '❌ Failed to load a trivia question. Try again.' });
    }
  },
};
