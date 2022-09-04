import { client } from '..';
import { Event } from '../structures/Event';

export default new Event('guildDelete', guild => {
  client.db.guilds
    .findFirst({
      where: {
        id: guild.id
      }
    })
    .then(async doc => {
      if (doc) {
        await client.db.guilds.delete({
          where: {
            id: guild.id
          }
        });
      }
    });
});
