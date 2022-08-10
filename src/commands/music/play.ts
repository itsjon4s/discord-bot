import { ApplicationCommandOptionType, GuildMember } from 'discord.js';
import { SearchResult, ConnectionState } from 'vulkava';
import { Command } from '../../structures/Command';
import { Queue } from '../../structures/Queue';

export default new Command({
  name: 'play',
  description: 'Add a song/playlist to the queue',
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
  async exec({ interaction, client }) {
    let player = client.manager.players.get(interaction.guild.id);
    const song = interaction.options.getString('song');

    const res: SearchResult = await client.manager.search(song);

    if (res.loadType === 'NO_MATCHES')
      return interaction.reply({
        content: '**☝️ There was no matches for that.**',
        ephemeral: true
      });

    if (res.loadType === 'LOAD_FAILED')
      return interaction.reply({
        content: `**☝️ There was an error playing this song.**\n \`\`\`${res.exception}\`\`\``,
        ephemeral: true
      });

    if (!player) {
      player = client.manager.createPlayer({
        guildId: interaction.guild.id,
        voiceChannelId: (interaction.member as GuildMember)?.voice?.channelId,
        textChannelId: interaction.channel.id,
        selfDeaf: true,
        queue: new Queue()
      });
      player.filters.setVolume(30);
    }

    if (player.state === ConnectionState.DISCONNECTED) player.connect();

    if (res.loadType === 'PLAYLIST_LOADED') {
      for (const track of res.tracks) {
        track.setRequester(interaction.user);
        player.queue.add(track);
      }

      if (!player.playing) player.play();
      return interaction.reply({
        content: `**🎤 Added the playlist \`${res.playlistInfo.name.replaceAll('`', '"')}\` with \`${res.tracks.length}\` tracks.**`
      });
    }
    const track = res.tracks[0];
    track.setRequester(interaction.user);
    player.queue.add(track);

    if (!player.playing) player.play();
    return interaction.reply({
      content: `**🎤 Added to the queue the music \`${track.title.replaceAll('`', '"')}\`**`
    });
  }
});
