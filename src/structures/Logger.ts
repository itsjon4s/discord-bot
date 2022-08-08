import { createLogger as createWinstonLogger, format, Logger, LoggerOptions } from 'winston';
import { Console, File } from 'winston/lib/winston/transports';
import { inspect } from 'node:util';
import type { Siesta } from './Client';

function loadWinstonLogger(logger: Logger, shardId: string | number = 'Manager') {
  logger
    .add(
      new Console({
        level: 'silly',
        format: format.combine(
          format.timestamp(),
          format.colorize(),
          format.printf(info => {
            const tags = info.tags?.map((t: string) => `\x1B[36m${t}\x1B[39m`).join(', ') ?? '';
            const shardPrefix = ` --- [\x1B[36mShard ${shardId}\x1B[39m, ${tags}]:`;
            return `${info.timestamp} ${shardPrefix} ${info.message instanceof Error ? inspect(info.message, { depth: 0 }) : info.message}`;
          })
        )
      })
    )
    .add(
      new File({
        level: 'debug',
        filename: typeof shardId === 'number' ? `shard${shardId}.log` : 'manager.log',
        dirname: './logs',
        format: format.combine(
          format.timestamp(),
          format.uncolorize(),
          format.printf(info => {
            const tags = info.tags?.map((t: string) => `\x1B[36m${t}\x1B[39m`).join(', ') ?? '';
            return `${info.timestamp} --- [Shard ${shardId}, ${tags}]: ${info.message instanceof Error ? inspect(info.message, { depth: 0 }) : info.message}`;
          })
        )
      })
    );
}

export function createLogger(options?: LoggerOptions, client?: Siesta) {
  const logger = createWinstonLogger({
    handleExceptions: options?.handleExceptions ?? true,
    handleRejections: options?.handleRejections ?? true,
    exitOnError: false
  });
  loadWinstonLogger(logger, client?.shard?.ids[0] ?? 'Manager');

  return logger;
}

export { Logger };
