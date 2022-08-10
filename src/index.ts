import { Siesta } from './structures/Client';

export const client = new Siesta();

client.init();

process.on('uncaughtException', (err: Error) => client.logger.warn(err.stack, { tags: ['Process'] }));
process.on('unhandledRejection', (err: Error) => client.logger.warn(err.stack, { tags: ['Process'] }));