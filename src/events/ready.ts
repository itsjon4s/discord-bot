import { client } from '..';
import { Event } from '../structures/Event';

export default new Event('ready', () => {
  client.logger.info(`${client.user.tag} is now online!`, { tags: ['Bot'] });
});
