import { Siesta } from './structures/Client';

export const client = new Siesta();

client.init();

process.on('uncaughtException', err => client.logger.warn(err));
process.on('unhandledRejection', err => client.logger.warn(err));
