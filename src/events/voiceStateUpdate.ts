/* eslint-disable no-promise-executor-return */

import { ChannelType } from 'discord.js';
import { client } from '..';
import { Event } from '../structures/Event';

const sleep = (ms: number): Promise<unknown> => new Promise(resolve => setTimeout(resolve, ms));

export default new Event('voiceStateUpdate', async (oldState, newState) => {
  const channel = newState.guild.channels.cache.get(newState.channelId);
  const player = client.manager.players.get(oldState.guild.id);

  if (!player) return;
  if (newState.id === client.user.id && channel?.type === ChannelType.GuildStageVoice) {
    if (!oldState.guild.members.me.voice.channelId) {
      if (!newState.requestToSpeakTimestamp) {
        await newState.guild.members.me.voice.setSuppressed(false).catch(() => {
          newState.guild.members.me.voice.setRequestToSpeak(true);
        });
      }
    }
  }

  if (!newState.guild.members.me.voice.channelId) return player.destroy();
  if (oldState.guild.members.cache.get(client.user.id).voice.channelId === oldState.channelId) {
    if (oldState.guild.members.me.voice?.channel && oldState.guild.members.me.voice.channel.members.filter(m => !m.user.bot).size === 0) {
      await sleep(180000);
      const vcMembers = oldState.guild.members.me.voice.channel?.members.filter(m => !m.user.bot).size;
      if (!vcMembers) return player.destroy();
    }
  }
});
