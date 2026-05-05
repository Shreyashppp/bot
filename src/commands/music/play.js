const { SlashCommandBuilder } = require('discord.js');
const { errorEmbed, infoEmbed } = require('../../utils/embeds');
const MusicQueue = require('../../utils/musicManager');
const play = require('play-dl');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from YouTube')
    .addStringOption(opt => opt.setName('query').setDescription('Song name or YouTube URL').setRequired(true)),

  async execute(interaction, client) {
    const query = interaction.options.getString('query');
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel)
      return interaction.reply({ embeds: [errorEmbed('You must be in a voice channel to play music.')], ephemeral: true });

    const perms = voiceChannel.permissionsFor(interaction.guild.members.me);
    if (!perms.has('Connect') || !perms.has('Speak'))
      return interaction.reply({ embeds: [errorEmbed("I don't have permission to join your voice channel.")], ephemeral: true });

    await interaction.deferReply();

    try {
      let trackInfo;
      if (query.includes('youtube.com') || query.includes('youtu.be')) {
        const info = await play.video_info(query);
        trackInfo = {
          title: info.video_details.title,
          url: info.video_details.url,
          duration: info.video_details.durationRaw,
          thumbnail: info.video_details.thumbnails[0]?.url,
          requester: interaction.user.tag,
        };
      } else {
        const results = await play.search(query, { limit: 1 });
        if (!results.length)
          return interaction.editReply({ embeds: [errorEmbed('No results found.')] });

        const video = results[0];
        trackInfo = {
          title: video.title,
          url: video.url,
          duration: video.durationRaw,
          thumbnail: video.thumbnails[0]?.url,
          requester: interaction.user.tag,
        };
      }

      let queue = client.queues.get(interaction.guild.id);
      if (!queue) {
        queue = new MusicQueue(interaction.guild.id, interaction.channel, voiceChannel);
        client.queues.set(interaction.guild.id, queue);
        await queue.connect();
      }

      queue.tracks.push(trackInfo);
      if (!queue.playing) {
        await queue._playNext();
        await interaction.editReply({ embeds: [infoEmbed('🎵 Starting Playback', `**[${trackInfo.title}](${trackInfo.url})**`)] });
      } else {
        await interaction.editReply({ embeds: [infoEmbed('📋 Added to Queue', `**[${trackInfo.title}](${trackInfo.url})**\nPosition: **${queue.tracks.length}**`)] });
      }
    } catch (err) {
      console.error(err);
      await interaction.editReply({ embeds: [errorEmbed('Failed to load that track. Try a different search.')] });
    }
  },
};
