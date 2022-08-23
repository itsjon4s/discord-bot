import fastifyCors from '@fastify/cors';
import fastify, { FastifyInstance } from 'fastify';
import { Siesta } from '../structures/Client';

export class WebServer {
  server: FastifyInstance;
  client: Siesta;
  constructor(client: Siesta) {
    this.server = fastify({ logger: true });
    this.client = client;
  }

  init() {
    this.server.register(fastifyCors, {
      origin: '*'
    });

    this.server.get('/stats', (_req, res) => {
      const guilds = this.client.guilds.cache.size;
      const commands = this.client.commands.size;

      res.status(200).send({
        guilds,
        commands
      });
    });

    this.server.listen({ port: 5555 });
  }
}
