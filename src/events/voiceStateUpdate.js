const { ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  eventName: 'voiceStateUpdate',
  async execute(oldState, newState, client) {
    const guild = newState.guild || oldState.guild;
    const jtcConfig = client.db.getJTC(guild.id);

    if (jtcConfig && newState.channelId === jtcConfig.hub_channel_id) {
      const member = newState.member;
      const name = (jtcConfig.name_template || "{user}'s Channel")
        .replace(/{user}/g, member.displayName)
        .replace(/{username}/g, member.user.username);

      try {
        const channel = await guild.channels.create({
          name,
          type: ChannelType.GuildVoice,
          parent: jtcConfig.category_id || newState.channel.parentId,
          permissionOverwrites: [
            { id: member.id, allow: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.MoveMembers] },
          ],
        });
        await member.voice.setChannel(channel);
        client.db.addJTCChannel(channel.id, guild.id, member.id);
      } catch (err) {
        console.error('JTC channel create error:', err);
      }
    }

    if (oldState.channelId) {
      const jtcChannel = client.db.getJTCChannel(oldState.channelId);
      if (jtcChannel) {
        const channel = guild.channels.cache.get(oldState.channelId);
        if (channel && channel.members.size === 0) {
          await channel.delete().catch(() => {});
          client.db.removeJTCChannel(oldState.channelId);
        }
      }
    }
  },
};
