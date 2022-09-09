import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction } from 'discord.js';
import { client } from '../..';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'welcome',
  description: '📝 › Configure the welcome message in this server.',
  dmPermission: false,
  prefixCompatible: false,
  options: [
    {
      name: 'channel',
      description: '📝 › Sets the channel where the welcome message is going to be sent.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'channel',
          description: 'The channel where the welcome message is going to be sent.',
          type: ApplicationCommandOptionType.Channel,
          channelTypes: [ChannelType.GuildText],
          required: true
        }
      ]
    },
    {
      name: 'status',
      description: '📝 › Sets the status of the welcome system.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'status',
          description: 'The status of the system.',
          type: ApplicationCommandOptionType.Boolean,
          required: true
        }
      ]
    },
    {
      name: 'message',
      description: '📝 › Sets the message of the welcome system.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'message',
          description: 'The message that is going to be send.',
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ]
    }
  ],
  async exec({ context }) {
    if (!context.member.permissions.has('ManageGuild')) {
      return context.reply({
        content: '**☝️ You need have the `Manage Guild` permission to execute this command.**'
      });
    }

    const doc = await client.db.guilds.findUnique({
      where: {
        id: context.guildId
      }
    });

    switch (context.args[0]) {
      case 'channel':
        const channel = context.client.channels.cache.get(context.args[1]);
        await context.client.db.guilds.update({
          where: {
            id: context.guildId
          },
          data: {
            welcome: {
              channel: channel.id,
              status: doc.welcome.status,
              message: doc.welcome.message
            }
          }
        });
        context.reply({
          content: `**📝 The channel was sucessfully set to ${channel}.**`
        });
        break;

      case 'status':
        const status = (context.interaction as ChatInputCommandInteraction).options.getBoolean('status');
        await context.client.db.guilds.update({
          where: {
            id: context.guildId
          },
          data: {
            welcome: {
              channel: doc.welcome.channel,
              status,
              message: doc.welcome.message
            }
          }
        });
        context.reply({
          content: `**📝 The status was sucessfully set to \`${status.toString()}\`.**`
        });
        break;

      case 'message':
        const message = context.args.slice(1).join(' ');
        await context.client.db.guilds.update({
          where: {
            id: context.guildId
          },
          data: {
            welcome: {
              channel: doc.welcome.channel,
              status: doc.welcome.status,
              message
            }
          }
        });
        context.reply({
          content:
            '**📝 The message was sucessfully updated**, If you wanna customize your message here is a litle list of placeholders you can use:' +
            '```/member - Mentions the member that joined\n/serverName/ - Displays your server name\n/memberId/ - Displays the member that joined id\n/memberName/ - Displays the member usename```'
        });
        break;
    }
  }
});
