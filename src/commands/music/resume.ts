import { Command } from '../../structures/Command';

export default new Command({
  name: 'resume',
  description: '🎶 › Resumes the player.',
  playerOnly: true,
  sameChannelOnly: true,
  dmPermission: false,
  aliases: ['unpause'],
  exec({ context }) {
    if (!context.player.current) {
      return context.reply({
        content: "☝️ There ins't any song playing right now."
      });
    }

    context.player.pause(false);
    return context.reply({
      content: '**🎤 The player was resumed sucessfully.**'
    });
  }
});
