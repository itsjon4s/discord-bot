import { Siesta } from './structures/Client';

export const client = new Siesta();
client.init();

const errorHandler = (err: Error) => {
  if (err.message === 'Missing Permissions' || err.message === 'Missing Acess') return;
  client.logger.warn(err.stack, { tags: ['Process'] });
};

process.on('uncaughtException', errorHandler);
process.on('unhandledRejection', errorHandler);


