import { Siesta } from './structures/Client';

export const client = new Siesta();

client.init();

process.on('uncaughtException', (err: Error) => {
  if (err.message === 'Missing Permissions' || err.message === 'Missing Acess') return;
  client.logger.warn(err.stack, { tags: ['Process'] });
});
process.on('unhandledRejection', (err: Error) => {
  if (err.message === 'Missing Permissions' || err.message === 'Missing Acess') return;
  client.logger.warn(err.stack, { tags: ['Process'] });
});