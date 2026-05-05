const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  entersState,
  getVoiceConnection,
} = require('@discordjs/voice');
const play = require('play-dl');
const { EmbedBuilder } = require('discord.js');
const { COLORS } = require('./embeds');

class MusicQueue {
  constructor(guildId, textChannel, voiceChannel) {
    this.guildId = guildId;
    this.textChannel = textChannel;
    this.voiceChannel = voiceChannel;
    this.connection = null;
    this.player = createAudioPlayer();
    this.tracks = [];
    this.currentTrack = null;
    this.volume = 100;
    this.loop = false;
    this.playing = false;

    this.player.on(AudioPlayerStatus.Idle, () => this._playNext());
    this.player.on('error', (err) => {
      console.error('Player error:', err);
      this._playNext();
    });
  }

  async connect() {
    this.connection = joinVoiceChannel({
      channelId: this.voiceChannel.id,
      guildId: this.guildId,
      adapterCreator: this.voiceChannel.guild.voiceAdapterCreator,
    });
    this.connection.subscribe(this.player);
    await entersState(this.connection, VoiceConnectionStatus.Ready, 10_000);
  }

  async addTrack(track) {
    this.tracks.push(track);
    if (!this.playing) await this._playNext();
  }

  async _playNext() {
    if (this.loop && this.currentTrack) {
      this.tracks.unshift(this.currentTrack);
    }

    if (this.tracks.length === 0) {
      this.playing = false;
      this.currentTrack = null;
      setTimeout(() => {
        const conn = getVoiceConnection(this.guildId);
        if (conn) conn.destroy();
      }, 30000);
      return;
    }

    this.currentTrack = this.tracks.shift();
    this.playing = true;

    try {
      const stream = await play.stream(this.currentTrack.url, { quality: 2 });
      const resource = createAudioResource(stream.stream, { inputType: stream.type });
      this.player.play(resource);

      const embed = new EmbedBuilder()
        .setColor(COLORS.music)
        .setTitle('🎵 Now Playing')
        .setDescription(`**[${this.currentTrack.title}](${this.currentTrack.url})**`)
        .addFields(
          { name: 'Duration', value: this.currentTrack.duration, inline: true },
          { name: 'Requested by', value: `${this.currentTrack.requester}`, inline: true }
        )
        .setThumbnail(this.currentTrack.thumbnail);

      this.textChannel.send({ embeds: [embed] });
    } catch (err) {
      console.error('Failed to play track:', err);
      this.textChannel.send(`❌ Failed to play **${this.currentTrack.title}**. Skipping...`);
      this._playNext();
    }
  }

  skip() {
    this.player.stop();
  }

  stop() {
    this.loop = false;
    this.tracks = [];
    this.player.stop();
    const conn = getVoiceConnection(this.guildId);
    if (conn) conn.destroy();
    this.playing = false;
  }

  pause() {
    return this.player.pause();
  }

  resume() {
    return this.player.unpause();
  }

  toggleLoop() {
    this.loop = !this.loop;
    return this.loop;
  }

  getState() {
    return this.player.state.status;
  }
}

module.exports = MusicQueue;
