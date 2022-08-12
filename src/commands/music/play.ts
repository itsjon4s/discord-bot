import { ApplicationCommandOptionType } from 'discord.js';
import { SearchResult, ConnectionState } from 'vulkava';
import { Command } from '../../structures/Command';
import { Queue } from '../../structures/Queue';

export default new Command({
  name: 'play',
  description: '🎶 › Add a song/playlist to the queue.',
  playerOnly: false,
  sameChannelOnly: true,
  ownerOnly: false,
  options: [
    {
      name: 'song',
      description: 'The name/url',
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true
    }
  ],
  aliases: ['p', 'tocar'],
  dmPermission: false,
  async exec({ context, client }) {
    let player = client.manager.players.get(context.guild.id);

    if (!context.args[0]) {
      return context.reply({
        content: '**☝️ You must send the song name or url to add to the queue**'
      });
    }
    
    const song = context.args.join(' ');
    
    const res: SearchResult = await client.manager.search(song);

    if (res.loadType === 'NO_MATCHES')
      return context.reply({
        content: '**☝️ There was no matches for that.**',
        ephemeral: true
      });

    if (res.loadType === 'LOAD_FAILED')
      return context.reply({
        content: `**☝️ There was an error playing this song.**\n \`\`\`${res.exception}\`\`\``,
        ephemeral: true
      });

    if (!player) {
      player = client.manager.createPlayer({
        guildId: context.guild.id,
        voiceChannelId: context.member?.voice?.channelId,
        textChannelId: context.channel.id,
        selfDeaf: true,
        queue: new Queue()
      });
      player.filters.setVolume(30);
    }

    if (player.state === ConnectionState.DISCONNECTED) player.connect();

    if (res.loadType === 'PLAYLIST_LOADED') {
      for (const track of res.tracks) {
        track.setRequester(context.user);
        player.queue.add(track);
      }

      if (!player.playing) player.play();
      return context.reply({
        content: `**🎤 Added the playlist \`${res.playlistInfo.name.replaceAll('`', '"')}\` with \`${res.tracks.length}\` tracks.**`
      });
    }
    const track = res.tracks[0];
    track.setRequester(context.user);
    player.queue.add(track);

    if (!player.playing) player.play();
    return context.reply({
      content: `**🎤 Added to the queue the music \`${track.title.replaceAll('`', '"')}\`**`
    });
  }
});
